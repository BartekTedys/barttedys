export default function OtherWork() {
  const PROJECTS = [
    {
      title: 'EkoDorStal - Steel Trading Platform & MS365 Admin',
      year: '2026',
      tags: ['React', 'Next.js', 'Microsoft 365'],
      summary: 'Designed, built and launched the platform website for a B2B/B2C marketplace trading surplus industrial steel, now expanding into a full e-commerce shop platform. Also set up and administer Microsoft 365 for the business, including email services and multi-factor authentication.',
    },
    {
      title: 'AI Model Training & Prompt Engineering - Outlier',
      year: '2024 - Present',
      tags: ['Prompt Engineering', 'LLM Evaluation', 'QA'],
      summary: 'Write and refine prompts to elicit, test and evaluate AI model responses across generalist, multilingual and technical domains. Evaluate multimodal outputs (text, image, speech) and lead quality assurance on training datasets across international projects.',
    },
    {
      title: 'M&L Home Builds - Business Website & Ongoing IT',
      year: '2023 - Present',
      tags: ['React', 'Vite', 'Next.js', 'Supabase'],
      summary: 'Designed and built a conversion-focused website for an Irish home renovation company, later rebuilt in React with Vite for a refreshed design and more interactivity. Separately built a full-stack contract and quotation tool (Next.js, Supabase, automated contract signing) used in the client\u2019s day-to-day operations, and manage ongoing hosting and email for the business.',
    },
    {
      title: 'Caeli - Computer Vision Internship',
      year: '2024',
      tags: ['Python', 'PyTorch', 'Computer Vision', 'Remote Sensing'],
      summary: 'Internship at Caeli, a Dutch startup using AI to monitor vegetation from aerial imagery. Trained and evaluated object detection models on satellite and drone data. This experience directly led to my thesis on tree canopy segmentation.',
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
          <div key={p.title} className='two-col-grid' style={{
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