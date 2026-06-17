'use client'
import { useState } from 'react'
import { useIsMobile } from '@/lib/useIsMobile'

export default function ModelInfo() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState<'overview' | 'methodology' | 'results' | 'limitations'>('overview')

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'methodology', label: 'Methodology' },
    { key: 'results', label: 'Results' },
    { key: 'limitations', label: 'Limitations' },
  ] as const

  return (
    <section id='research' style={{
      width: '100%',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '6rem clamp(2rem, 6vw, 8rem)',
        width: '100%',
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          color: 'var(--green-primary)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          Research
        </p>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          marginBottom: '3rem',
        }}>
          About the model
        </h2>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0',
          borderBottom: '1px solid var(--border)',
          marginBottom: '3rem',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid var(--green-primary)' : '2px solid transparent',
                color: activeTab === tab.key ? 'var(--green-primary)' : 'var(--text-dim)',
                cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                transition: 'all 0.2s',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className='two-col-grid' style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'start',
        }}>
          {activeTab === 'overview' && (
            <>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '1.5rem' }}>
                  This model is the output of my final year thesis at Munster Technological University: a comparative analysis of three instance segmentation architectures for detecting individual tree canopies in urban aerial imagery.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '1.5rem' }}>
                  Urban green spaces are critical to environmental sustainability and quality of life, but effective monitoring at scale remains difficult. This research investigates whether deep learning can automate tree crown delineation accurately enough to be useful for urban forestry and planning applications.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, fontWeight: 300 }}>
                  The three models evaluated were YOLOv11, Mask R-CNN, and YOLACT++. YOLOv11x-seg, the model running on this site, outperformed the others across all key metrics.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Architecture', value: 'YOLOv11x-seg' },
                  { label: 'Training data', value: 'Custom annotated dataset, Netherlands aerial imagery' },
                  { label: 'Image source', value: 'PDOK Beeldmateriaal — 8cm & 25cm/px RGB orthophotos' },
                  { label: 'Tile size', value: '640 × 640px' },
                  { label: 'Framework', value: 'Ultralytics / PyTorch' },
                  { label: 'Deployment', value: 'ONNX → QGIS Deepness plugin / Modal serverless' },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1rem',
                    paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.05em', textTransform: 'uppercase', paddingTop: '0.1rem' }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'methodology' && (
            <>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Dataset</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '1.5rem' }}>
                  A custom dataset was created using Roboflow, with manually annotated instance segmentation masks over Dutch urban aerial imagery. Existing public datasets were found to be incomplete or inconsistent for this specific task. The annotation process required careful handling of overlapping canopies — dense forest areas where individual crowns couldn't be distinguished were annotated as unified clusters, while clearly isolated trees were annotated individually.
                </p>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Training</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '1.5rem' }}>
                  All three models were trained using transfer learning from MS COCO pre-trained weights, which significantly reduced training time given the relatively small dataset. YOLOv11 was trained using the Ultralytics framework with cosine annealing learning rate scheduling and multi-criteria early stopping. The dataset was augmented through rotations and flipping.
                </p>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Evaluation</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, fontWeight: 300 }}>
                  All models were evaluated using a standardised framework with the Hungarian algorithm for optimal instance matching — ensuring mathematically fair comparison between predicted and ground-truth canopies. Metrics included mAP at IoU thresholds from 0.50 to 0.95, boundary precision/recall/F1, and performance stratified by tree density and size.
                </p>
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>GIS integration</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '1.5rem' }}>
                  All models were converted to ONNX format and deployed within QGIS using the Deepness plugin, which handles sliding-window tiling across large aerial mosaics and stitches results back into georeferenced vector layers. This pipeline was used to produce the Wageningen city-scale inference shown on this site.
                </p>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Initial experimentation</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, fontWeight: 300 }}>
                  Feasibility work began in early 2024 using YOLOv8, achieving a proof-of-concept mAP of 0.54 with a 200-image annotated dataset. This informed the methodology for the full comparative study with the three architectures.
                </p>
              </div>
            </>
          )}

          {activeTab === 'results' && (
            <>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '2rem' }}>
                  YOLOv11x-seg outperformed both Mask R-CNN and YOLACT++ across all primary metrics, with a particularly significant lead in mAP50 — the standard detection benchmark at 50% IoU overlap.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {[
                    { metric: 'mAP50', yolo: '0.623', yolact: '0.377', maskrcnn: '0.390', note: 'Detection accuracy at 50% IoU' },
                    { metric: 'Avg IoU', yolo: '0.790', yolact: '0.777', maskrcnn: '0.643', note: 'Mask overlap with ground truth' },
                    { metric: 'mAP50–95', yolo: '0.194', yolact: '0.143', maskrcnn: '0.143', note: 'Averaged across IoU thresholds' },
                    { metric: 'Boundary F1', yolo: '0.229', yolact: '0.251', maskrcnn: '0.171', note: 'Precision of crown boundary' },
                  ].map((row, i) => (
                    <div key={row.metric} style={{
                      display: 'grid',
                      gridTemplateColumns: '110px repeat(3, 1fr)',
                      gap: '1rem',
                      padding: '0.9rem 0',
                      borderTop: i === 0 ? '1px solid var(--border)' : 'none',
                      borderBottom: '1px solid var(--border)',
                      alignItems: 'center',
                    }}>
                      <div>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{row.metric}</p>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{row.note}</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', color: 'var(--green-primary)', fontWeight: 500 }}>{row.yolo}</p>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>YOLOv11x</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{row.yolact}</p>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>YOLACT++</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{row.maskrcnn}</p>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>Mask R-CNN</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, fontWeight: 300 }}>
                  YOLOv11 achieved an mAP50 of 0.623 — roughly 24 percentage points above the average of the other two models. At the stricter mAP75 threshold, the gap widens further, suggesting YOLOv11 produces more precisely aligned segmentation masks rather than just approximate detections. Boundary F1 scores were lower across all models, reflecting the genuine difficulty of delineating exact crown perimeters in dense urban canopy — a known challenge in the field.
                </p>
              </div>
            </>
          )}

          {activeTab === 'limitations' && (
            <>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '2rem' }}>
                  This is a research prototype built within the constraints of a final year undergraduate thesis. The results are promising, but a number of known limitations should be understood when interpreting the outputs.
                </p>
                {[
                  {
                    title: 'Dense forest annotation',
                    body: 'Where tree crowns overlap continuously — as in forest patches — it was not possible to annotate individual instances at this image resolution. These areas were annotated as unified clusters, which means the model cannot separate individual trees within dense canopy. You\'ll see this in the Wageningen result as large merged blobs in forested zones.',
                  },
                  {
                    title: 'Dataset size',
                    body: 'The training dataset was relatively small by deep learning standards. Transfer learning from COCO weights mitigated this significantly, but a larger and more diverse annotated dataset would meaningfully improve performance and generalisation.',
                  },
                  {
                    title: 'Image resolution constraints',
                    body: 'The publicly available PDOK imagery varies between 8cm and 25cm per pixel. At 25cm resolution, fine crown boundary delineation becomes difficult. A consistent 8cm dataset across the full training set would likely improve boundary precision.',
                  },
                  {
                    title: 'Seasonal variation',
                    body: 'The model was trained on leaf-on imagery. Performance on leaf-off aerial photos (autumn/winter captures) will be reduced. The PDOK base map may show imagery from different capture dates depending on the region.',
                  },
                  {
                    title: 'Single-class detection',
                    body: 'Due to class imbalance issues during training, the model was simplified to a single tree class rather than distinguishing individual trees from clusters. This is a known limitation that more training data and time would address.',
                  },
                ].map(item => (
                  <div key={item.title} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{item.title}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.75, fontWeight: 300 }}>{item.body}</p>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Future directions
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, fontWeight: 300, marginBottom: '1rem' }}>
                  The foundation is solid. With more annotated data, consistent high-resolution imagery, and further training, the model accuracy would improve substantially. Additional directions worth exploring include multispectral imagery (near-infrared helps distinguish vegetation from other green surfaces), species classification, and health assessment from crown texture.
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8, fontWeight: 300 }}>
                  The QGIS + Deepness integration already makes this practical for real urban forestry workflows — the pipeline from aerial imagery to GIS vector layer is complete and working. Scaling it up is an engineering and data problem, not a fundamental research one.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}