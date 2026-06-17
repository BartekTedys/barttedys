import { useIsMobile } from '@/lib/useIsMobile'
export default function OtherWork() {
  const isMobile = useIsMobile()
  const PROJECTS = [
    {
      title: 'Caeli - Computer Vision Internship',
      year: '2024',
      tags: ['Python', 'PyTorch', 'Computer Vision', 'Remote Sensing'],
      summary: 'Internship at Caeli, a Dutch startup using AI to monitor vegetation from aerial imagery. Trained and evaluated object detection models on satellite and drone data. This experience that directly led to my thesis on tree canopy segmentation.',
    },
    {
      title: 'M&L Home Builds - Business Website',
      year: '2023',
      tags: ['HTML', 'CSS', 'JavaScript'],
      summary: 'Designed and built a conversion-focused website for an Irish home renovation company. The site significantly increased their inbound leads within weeks of launch. Serves as a good reminder that clean frontend work has real business impact.',
    },
  ]

  return (
    <section style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 clamp(2rem, 6vw, 8rem) 6rem',
      width: '100%',
    }}>
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent, var(--border), transparent)',
        marginBottom: '3rem',
      }} />

      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.7rem',
        color: 'var(--green-primary)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: '2rem',
      }}>
        Other work
      </p>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {PROJECTS.map((p, i) => (
          <div key={p.title} style={{
            display: 'grid',
            gridTemplateColumns: 'clamp(160px, 18%, 220px) 1fr',
            gap: '3rem',
            alignItems: 'start',
            padding: '1.75rem 0',
            borderTop: '1px solid var(--border)',
            borderBottom: i === PROJECTS.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                color: 'var(--text-dim)',
                marginBottom: '0.75rem',
              }}>
                {p.year}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {p.tags.map(t => (
                  <span key={t} style={{
                    padding: '0.15rem 0.5rem',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '3px',
                    fontSize: '0.68rem',
                    color: 'var(--text-dim)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.6rem',
                letterSpacing: '-0.01em',
              }}>
                {p.title}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.75,
                fontWeight: 300,
              }}>
                {p.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
