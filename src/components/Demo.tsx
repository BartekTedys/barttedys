'use client'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

type Stage = 'idle' | 'processing' | 'done' | 'error'

const STAGES = [
  { label: 'Receiving image' },
  { label: 'Preparing 640×640 tiles' },
  { label: 'Running YOLOv11x segmentation' },
  { label: 'Generating mask overlay' },
]

const SAMPLES = [
  { src: '/sample1.jpg', label: 'Residential' },
  { src: '/sample2.jpg', label: 'Streetside' },
  { src: '/sample3.jpg', label: 'Park' },
  { src: '/sample4.jpg', label: 'Mixed' },
]

export default function Demo() {
  const [stage, setStage] = useState<Stage>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<{ image: string; stats: Record<string, number | string> } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentStageIdx, setCurrentStageIdx] = useState(-1)

  const runInference = async (file: File | Blob, previewUrl: string) => {
    setPreview(previewUrl)
    setResult(null)
    setError(null)
    setStage('processing')
    setCurrentStageIdx(0)

    await new Promise(r => setTimeout(r, 600))
    setCurrentStageIdx(1)
    await new Promise(r => setTimeout(r, 900))
    setCurrentStageIdx(2)

    try {
      const buffer = await file.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')

      const res = await fetch('/api/infer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()

      setCurrentStageIdx(3)
      await new Promise(r => setTimeout(r, 400))
      setResult(data)
      setStage('done')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Inference failed')
      setStage('error')
    }
  }

  const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    runInference(file, url)
  }, [])

  const loadSample = async (src: string) => {
    setStage('processing')
    setCurrentStageIdx(0)
    setPreview(src)
    setResult(null)
    setError(null)
    const res = await fetch(src)
    const blob = await res.blob()
    runInference(blob, src)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.tif', '.tiff'] },
    maxFiles: 1,
    disabled: stage === 'processing',
  })

  const reset = () => {
    setStage('idle')
    setPreview(null)
    setResult(null)
    setError(null)
    setCurrentStageIdx(-1)
  }

  return (
    <section id="demo" style={{
      padding: '8rem clamp(2rem, 6vw, 8rem)',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem', color: 'var(--green-primary)',
          letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem',
        }}>
          Live inference
        </p>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700,
          letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '1rem',
        }}>
          Upload aerial imagery
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '580px', fontWeight: 300 }}>
          Drop a top-down aerial image and the model will segment individual tree canopies.
          Use imagery zoomed to roughly street level. The model works best at resolutions of 8–25cm per pixel.
          No map labels or overlays. Processing takes 20–40s on CPU.
        </p>
      </div>

      {/* Sample images */}
      {stage === 'idle' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
            color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem',
          }}>
            Or try a sample
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {SAMPLES.map(s => (
              <button
                key={s.src}
                onClick={() => loadSample(s.src)}
                style={{
                  padding: 0, border: '1px solid var(--border)', borderRadius: '6px',
                  overflow: 'hidden', cursor: 'pointer', background: 'none',
                  transition: 'border-color 0.2s', width: '120px',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green-primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.label} style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }} />
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
                  color: 'var(--text-dim)', padding: '0.3rem 0.5rem', textAlign: 'center',
                }}>
                  {s.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Drop zone / processing / result */}
      <div style={{
        border: '1px solid var(--border)', borderRadius: '8px',
        overflow: 'hidden', background: 'var(--surface)',
      }}>
        {/* Idle drop zone */}
        {stage === 'idle' && (
          <div
            {...getRootProps()}
            style={{
              padding: '4rem 2rem', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '1rem', cursor: 'pointer',
              border: isDragActive ? '2px dashed var(--green-primary)' : '2px dashed transparent',
              background: isDragActive ? 'var(--green-faint)' : 'transparent',
              margin: '1px', borderRadius: '7px', transition: 'all 0.2s',
            }}
          >
            <input {...getInputProps()} />
            <div style={{
              width: '52px', height: '52px', border: '1px solid var(--border)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--green-primary)', fontSize: '1.4rem',
            }}>↑</div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.25rem' }}>
                {isDragActive ? 'Drop to analyse' : 'Drop your own image here'}
              </p>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace" }}>
                JPG · PNG · GeoTIFF - zoomed to street level, no map labels
              </p>
            </div>
          </div>
        )}

        {/* Processing */}
        {stage === 'processing' && (
          <div style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {preview && (
              <div style={{
                flex: '1 1 300px', aspectRatio: '1', minHeight: '260px',
                position: 'relative', overflow: 'hidden', borderRadius: '4px', border: '1px solid var(--border)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="input" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(74,222,128,0.04) 50%, transparent 100%)',
                  animation: 'scanline 2s linear infinite', pointerEvents: 'none',
                }} />
              </div>
            )}
            <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Processing
              </p>
              {STAGES.map((s, i) => {
                const done = i < currentStageIdx
                const active = i === currentStageIdx
                return (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                      background: done || active ? 'var(--green-primary)' : 'var(--border)',
                      boxShadow: active ? '0 0 8px var(--green-primary)' : 'none',
                    }} />
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem',
                      color: done ? 'var(--green-primary)' : active ? 'var(--text-primary)' : 'var(--text-dim)',
                    }}>
                      {done ? '✓ ' : active ? '→ ' : '  '}{s.label}
                    </span>
                  </div>
                )
              })}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}>
                CPU inference · ~30s
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {stage === 'error' && (
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.5rem' }}>Inference failed</p>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{error}</p>
            <button onClick={reset} style={{
              padding: '0.5rem 1.5rem', border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-secondary)',
              borderRadius: '4px', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem',
            }}>
              Try again
            </button>
          </div>
        )}

        {/* Result */}
        {stage === 'done' && result && (
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div style={{ flex: '1 1 280px' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Original</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {preview && <img src={preview} alt="original" style={{ width: '100%', borderRadius: '4px', border: '1px solid var(--border)' }} />}
              </div>
              <div style={{ flex: '1 1 280px' }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Detected canopies</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`data:image/png;base64,${result.image}`} alt="result"
                  style={{ width: '100%', borderRadius: '4px', border: '1px solid var(--green-primary)', boxShadow: '0 0 20px rgba(74,222,128,0.12)' }} />
              </div>
            </div>
            {result.stats && (
              <div style={{
                display: 'flex', gap: '2rem', padding: '1rem 1.5rem',
                background: 'var(--green-faint)', borderRadius: '4px',
                border: '1px solid var(--green-muted)', flexWrap: 'wrap', marginBottom: '1rem',
              }}>
                {Object.entries(result.stats).map(([k, v]) => (
                  <div key={k}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: 'var(--green-primary)', marginBottom: '0.2rem' }}>{String(v)}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k.replace(/_/g, ' ')}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={reset} style={{
              padding: '0.4rem 1rem', border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text-secondary)', borderRadius: '4px',
              cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem',
            }}>
              Upload another
            </button>
          </div>
        )}
      </div>

      <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: "'JetBrains Mono', monospace" }}>
        → Or <a href="#citymap" style={{ color: 'var(--green-primary)', textDecoration: 'none' }}>select a region on the map below</a> to pull live PDOK aerial tiles automatically.
      </p>
    </section>
  )
}
