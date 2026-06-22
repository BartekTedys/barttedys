'use client'
import { useIsMobile } from '@/lib/useIsMobile'

export default function About() {
  const isMobile = useIsMobile()
  const skills = [
    { cat: 'ML / Vision', items: ['YOLOv11', 'PyTorch', 'TensorFlow', 'Instance Segmentation', 'QGIS', 'Deepness'] },
    { cat: 'Backend', items: ['Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'REST APIs'] },
    { cat: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
    { cat: 'Geospatial', items: ['PDOK / WMS/WMTS', 'GeoJSON', 'Leaflet', 'Remote Sensing', 'Aerial Imagery'] },
  ]

  const links = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bartlomiej-tedys-6418ab251/', icon: '↗' },
    { label: 'GitHub', href: 'https://github.com/BartekTedys', icon: '↗' },
    { label: 'Download CV', href: '/CV_Bartlomiej_Tedys', icon: '↓' },
  ]

  return (
    <section id="about" style={{ width: '100%', background: 'var(--surface)' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '8rem clamp(2rem, 6vw, 8rem)',
      }}>
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--border), transparent)',
          marginBottom: '5rem',
        }} />

        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          color: 'var(--green-primary)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          About
        </p>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          lineHeight: 1.0,
          marginBottom: '4rem',
        }}>
          Who I am
        </h2>

        <div className="two-col-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '5rem',
          alignItems: 'start',
        }}>
          {/* Bio column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
              <img
                src="/photo.jpg"
                alt="Bartek Tedys"
                style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  objectFit: 'cover', border: '2px solid var(--green-muted)',
                  flexShrink: 0,
                }}
              />
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem', fontSize: '1.05rem' }}>Bartlomiej Tedys</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Ireland → Netherlands
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {[
                `I'm Bartek, a software developer and ML engineer who just finished a BSc in Software Development at Munster Technological University in Cork, with a semester abroad at Hogeschool van Amsterdam.`,
                `My thesis compared three instance segmentation models for detecting individual tree canopies in aerial imagery. YOLOv11x came out on top. The model on this page is the result of that work.`,
                `I'm based in Ireland right now and relocating to the Netherlands, a country I have a lot of respect for, both technically and professionally. I'm looking for roles in geospatial ML, computer vision, or software development in the Dutch tech scene.`,
                `Beyond the trees: I've built web apps, data pipelines, mobile applications, and done freelance development for small businesses. I like problems that sit at the intersection of data and real-world impact.`,
              ].map((para, i) => (
                <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, fontWeight: 300 }}>
                  {para}
                </p>
              ))}
            </div>

            {/* Desktop only: links and availability stay in bio column */}
            {!isMobile && (
              <>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                  {links.map(l => (
                    <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
                      padding: '0.45rem 1rem', border: '1px solid var(--border)', borderRadius: '4px',
                      color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem',
                      fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center',
                      gap: '0.4rem', transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-primary)'; e.currentTarget.style.color = 'var(--green-primary)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                    >
                      {l.label} {l.icon}
                    </a>
                  ))}
                </div>
                <div style={{
                  marginTop: '2rem', padding: '0.85rem 1.25rem',
                  background: 'var(--green-faint)', border: '1px solid var(--green-muted)',
                  borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: 'var(--green-primary)', flexShrink: 0,
                    boxShadow: '0 0 8px var(--green-primary)',
                  }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>
                    Available for work - open to roles in the Netherlands
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Skills + Education column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingTop: '1rem' }}>
            <div>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
                color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem',
              }}>
                Technical skills
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {skills.map(group => (
                  <div key={group.cat}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--green-primary)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.6rem', letterSpacing: '0.05em' }}>
                      {group.cat}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {group.items.map(item => (
                        <span key={item} style={{
                          padding: '0.25rem 0.7rem', background: 'var(--bg)',
                          border: '1px solid var(--border)', borderRadius: '3px',
                          fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
                color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem',
              }}>
                Education
              </p>
              {[
                {
                  school: 'Munster Technological University',
                  location: 'Cork, Ireland',
                  years: '2021 – 2025',
                  degree: 'BSc Software Development (Honours)',
                  note: 'Thesis: Comparative analysis of instance segmentation models for urban tree crown delineation',
                },
                {
                  school: 'Hogeschool van Amsterdam',
                  location: 'Amsterdam, Netherlands',
                  years: '2023 – 2024',
                  degree: 'Erasmus Exchange - Big Data & Mobile App Development',
                  note: null,
                },
              ].map(e => (
                <div key={e.school} style={{
                  paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{e.school}</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--text-dim)', whiteSpace: 'nowrap', marginLeft: '1rem' }}>{e.years}</p>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{e.degree}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{e.location}</p>
                  {e.note && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--green-primary)', marginTop: '0.5rem', fontFamily: "'JetBrains Mono', monospace", opacity: 0.8 }}>
                      → {e.note}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile only: links and availability at bottom of section */}
            {isMobile && (
              <>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {links.map(l => (
                    <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={{
                      padding: '0.45rem 1rem', border: '1px solid var(--border)', borderRadius: '4px',
                      color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem',
                      fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center',
                      gap: '0.4rem', transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green-primary)'; e.currentTarget.style.color = 'var(--green-primary)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                    >
                      {l.label} {l.icon}
                    </a>
                  ))}
                </div>
                <div style={{
                  padding: '0.85rem 1.25rem',
                  background: 'var(--green-faint)', border: '1px solid var(--green-muted)',
                  borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: 'var(--green-primary)', flexShrink: 0,
                    boxShadow: '0 0 8px var(--green-primary)',
                  }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>
                    Available for work - open to roles in the Netherlands
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}