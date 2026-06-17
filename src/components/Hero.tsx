'use client'
import { useEffect, useState } from 'react'
import { useIsMobile } from '@/lib/useIsMobile'

const TAGLINES = [
  'Tree canopy detection from aerial imagery.',
  'Instance segmentation at 8cm resolution.',
  'Urban forest mapping with YOLOv11.',
]

export default function Hero() {
  const [tagline, setTagline] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    const target = TAGLINES[tagline]
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 35)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 2200)
        return () => clearTimeout(t)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 18)
        return () => clearTimeout(t)
      } else {
        setTagline(i => (i + 1) % TAGLINES.length)
        setTyping(true)
      }
    }
  }, [displayed, typing, tagline])

  return (
    <section style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      paddingTop: '80px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '15%', left: '5%',
        width: '50vw', height: '50vw', maxWidth: '700px', maxHeight: '700px',
        background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '1400px', margin: '0 auto',
        padding: `0 clamp(1.5rem, 6vw, 8rem)`,
        position: 'relative', zIndex: 1,
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(0.6rem, 1vw, 0.75rem)',
          color: 'var(--green-primary)', letterSpacing: '0.15em',
          textTransform: 'uppercase', marginBottom: '1.5rem', opacity: 0.9,
        }}>
          Geospatial ML · Remote Sensing · Software Development
        </p>

        <h1 style={{
          fontSize: 'clamp(3.5rem, 12vw, 10rem)',
          fontWeight: 700, lineHeight: 0.95,
          color: 'var(--text-primary)', letterSpacing: '-0.04em', marginBottom: '0.5rem',
        }}>
          Bartek<br />
          <span style={{ color: 'var(--green-primary)' }}>Tedys</span>
        </h1>

        <div style={{ height: '2.5rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)',
            color: 'var(--text-secondary)', letterSpacing: '0.02em',
          }}>
            {displayed}
            <span className="animate-blink" style={{
              display: 'inline-block', width: '2px', height: '1.1em',
              background: 'var(--green-primary)', marginLeft: '2px', verticalAlign: 'middle',
            }} />
          </p>
        </div>

        {/* Description and CTAs - stack on mobile */}
        <div className='two-col-grid' style={{
          display: 'grid',
          gridTemplateColumns: 'clamp(280px, 40%, 560px) 1fr',
          gap: '4rem',
          alignItems: 'end', marginBottom: '5rem',
        }}>
          <p style={{
            fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)',
            color: 'var(--text-secondary)', lineHeight: 1.75, fontWeight: 300,
          }}>
            I trained a YOLOv11x segmentation model to detect individual tree canopies
            from aerial imagery at centimetre resolution. This is that model, running live.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="#demo" style={{
              padding: '0.85rem 2rem', background: 'var(--green-primary)', color: '#0a0f0a',
              borderRadius: '4px', fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#22c55e'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--green-primary)'; e.currentTarget.style.transform = 'none' }}
            >
              Run the model →
            </a>
            <a href="#citymap" style={{
              padding: '0.85rem 2rem', background: 'transparent', color: 'var(--text-secondary)',
              border: '1px solid var(--border)', borderRadius: '4px',
              fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)', textDecoration: 'none',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-primary)'; e.currentTarget.style.color = 'var(--green-primary)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              See city-scale results
            </a>
          </div>
        </div>

        {/* Stats - 2 cols on mobile, 4 on desktop */}
        <div className='stats-grid' style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          paddingTop: '2rem', borderTop: '1px solid var(--border)',
        }}>
          {[
            { value: '8cm', label: 'pixel resolution' },
            { value: 'YOLOv11x', label: 'segmentation model' },
            { value: '640px', label: 'tile size' },
            { value: 'PDOK', label: 'aerial source' },
          ].map(s => (
            <div key={s.label}>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                color: 'var(--green-primary)', fontWeight: 500, marginBottom: '0.35rem',
              }}>
                {s.value}
              </p>
              <p style={{
                fontSize: '0.7rem', color: 'var(--text-dim)',
                textTransform: 'uppercase', letterSpacing: '0.12em',
              }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}