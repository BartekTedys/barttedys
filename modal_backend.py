"""
Modal deployment for Bart Tedys tree canopy segmentation API.

Deploy with:
    python -m modal deploy modal_backend.py
"""

import modal
import io
import base64
import numpy as np
from pathlib import Path
import os
from starlette.requests import Request

app = modal.App("barttedys-canopy")

inference_image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("libgl1", "libglib2.0-0")
    .pip_install(
        "ultralytics==8.3.0",
        "torch==2.3.0",
        "torchvision==0.18.0",
        "opencv-python-headless==4.9.0.80",
        "numpy==1.26.4",
        "Pillow==10.3.0",
        "requests==2.31.0",
        "fastapi[standard]==0.111.0",
        "starlette",
    )
    .add_local_file(
        Path(__file__).parent / "best.pt",
        remote_path="/model/best.pt",
    )
)


@app.cls(
    image=inference_image,
    secrets=[modal.Secret.from_name("barttedys-secret")],
    cpu=2,
    memory=2048,
    timeout=120,
    scaledown_window =60,
)
class CanopyModel:
    @modal.enter()
    def load_model(self):
        from ultralytics import YOLO
        self.model = YOLO("/model/best.pt")
        self.model.conf = 0.5
        self.model.iou = 0.7
        print("Model loaded.")

    def _check_token(self, request: Request):
        token = request.headers.get("X-API-Token", "")
        expected = os.environ.get("API_SECRET_TOKEN", "")
        if token != expected:
            from fastapi import HTTPException
            raise HTTPException(status_code=401, detail="Unauthorised")

    def _run_inference(self, image_bgr: np.ndarray) -> dict:
        import cv2
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        results = self.model(image_bgr)
        vis = image_bgr.copy()
        masks, boxes, scores = [], [], []

        if results[0].masks is not None:
            import torch
            for r in results:
                if r.masks is not None:
                    m = r.masks.data
                    if isinstance(m, torch.Tensor):
                        m = m.cpu().numpy()
                    masks.extend(m)
                    if hasattr(r, "boxes"):
                        for box, score in zip(
                            r.boxes.xyxy.cpu().numpy(),
                            r.boxes.conf.cpu().numpy(),
                        ):
                            boxes.append(box)
                            scores.append(float(score))

        stats = {}
        if masks:
            overlay = vis.copy()
            colors = plt.cm.YlGn(np.linspace(0.3, 1.0, len(masks)))

            for i, mask in enumerate(masks):
                color = (int(colors[i][0]*255), int(colors[i][1]*255), int(colors[i][2]*255))
                mask_bool = mask.astype(bool)
                if mask_bool.shape != vis.shape[:2]:
                    mask_bool = cv2.resize(
                        mask_bool.astype(np.uint8),
                        (vis.shape[1], vis.shape[0]),
                        interpolation=cv2.INTER_NEAREST,
                    ).astype(bool)
                overlay[mask_bool] = color

            vis = cv2.addWeighted(overlay, 0.5, vis, 0.5, 0)

            for i, box in enumerate(boxes):
                c = (int(colors[min(i, len(colors)-1)][0]*255),
                     int(colors[min(i, len(colors)-1)][1]*255),
                     int(colors[min(i, len(colors)-1)][2]*255))
                cv2.rectangle(vis, (int(box[0]), int(box[1])), (int(box[2]), int(box[3])), c, 2)
                if i < len(scores):
                    cv2.putText(vis, f"{scores[i]:.2f}",
                        (int(box[0]), int(box[1])-5),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255,255,255), 1, cv2.LINE_AA)

            combined = np.zeros(image_bgr.shape[:2], dtype=bool)
            for mask in masks:
                mb = mask.astype(bool)
                if mb.shape != combined.shape:
                    mb = cv2.resize(mb.astype(np.uint8), (combined.shape[1], combined.shape[0]),
                                    interpolation=cv2.INTER_NEAREST).astype(bool)
                combined = np.logical_or(combined, mb)

            coverage = combined.sum() / (combined.shape[0] * combined.shape[1]) * 100
            stats = {
                "trees_detected": len(masks),
                "mean_confidence": f"{np.mean(scores):.2f}" if scores else "n/a",
                "canopy_coverage": f"{coverage:.1f}%",
            }
        else:
            stats = {"trees_detected": 0, "canopy_coverage": "0%"}

        _, buf = cv2.imencode(".png", vis)
        b64 = base64.b64encode(buf.tobytes()).decode()
        return {"image": b64, "stats": stats}

    @modal.fastapi_endpoint(method="POST", docs=False)
    def infer_upload(self, request: Request, body: dict) -> dict:
        import cv2
        self._check_token(request)
        
        import base64
        image_b64 = body.get("image")
        if not image_b64:
            return {"error": "No image provided"}
        
        arr = np.frombuffer(base64.b64decode(image_b64), np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            return {"error": "Could not decode image"}
        h, w = img.shape[:2]
        if max(h, w) > 1280:
            scale = 1280 / max(h, w)
            img = cv2.resize(img, (int(w * scale), int(h * scale)))
        return self._run_inference(img)

    @modal.fastapi_endpoint(method="POST", docs=False)
    def infer_map(self, request: Request, bbox: list[float]) -> dict:
        import requests as req
        import cv2
        self._check_token(request)

        min_lng, min_lat, max_lng, max_lat = bbox
        tile_size = 640

        wms_url = (
            "https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0"
            "?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap"
            f"&BBOX={min_lat},{min_lng},{max_lat},{max_lng}"
            "&CRS=EPSG:4326"
            f"&WIDTH={tile_size}&HEIGHT={tile_size}"
            "&LAYERS=2020_ortho25"
            "&STYLES=&FORMAT=image/jpeg"
        )

        resp = req.get(wms_url, timeout=30)
        if resp.status_code != 200 or "xml" in resp.headers.get("content-type", ""):
            return {"error": f"PDOK tile fetch failed: {resp.status_code}"}

        arr = np.frombuffer(resp.content, np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if img is None:
            return {"error": "Could not decode PDOK tile"}

        return self._run_inference(img)