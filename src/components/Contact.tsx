'use client'
import { useState } from 'react'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('https://formspree.io/f/mblybljn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', message: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.85rem 1rem',
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: '4px', color: 'var(--text-primary)',
    fontFamily: "'Space Grotesk', system-ui", fontSize: '0.95rem', outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <section id="contact" style={{ width: '100%' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '4rem clamp(2rem, 6vw, 8rem) 8rem',
      }}>
        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--border), transparent)',
          marginBottom: '5rem',
        }} />

        <div className="two-col-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '5rem',
          alignItems: 'start',
        }}>
          {/* Left */}
          <div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem',
              color: 'var(--green-primary)', letterSpacing: '0.2em',
              textTransform: 'uppercase', marginBottom: '0.75rem',
            }}>
              Contact
            </p>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 700, letterSpacing: '-0.03em',
              color: 'var(--text-primary)', lineHeight: 1.0, marginBottom: '1.5rem',
            }}>
              Get in touch
            </h2>
            <p style={{
              color: 'var(--text-secondary)', fontSize: '1rem',
              lineHeight: 1.75, fontWeight: 300, marginBottom: '2.5rem', maxWidth: '420px',
            }}>
              Whether you have a project in mind, want to discuss geospatial ML,
              or are looking to hire - I&apos;m open to conversations.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Email', value: 'barttedys@gmail.com', href: 'mailto:barttedys@gmail.com' },
                { label: 'LinkedIn', value: 'linkedin.com/in/bartlomiej-tedys', href: 'https://www.linkedin.com/in/bartlomiej-tedys/' },
                { label: 'GitHub', value: 'github.com/BartekTedys', href: 'https://github.com/BartekTedys' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '1.5rem', alignItems: 'baseline' }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem',
                    color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', minWidth: '65px',
                  }}>
                    {item.label}
                  </span>
                  <a href={item.href} target="_blank" rel="noreferrer" style={{
                    color: 'var(--text-secondary)', textDecoration: 'none',
                    fontSize: '0.9rem', fontFamily: "'JetBrains Mono', monospace", transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--green-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  >
                    {item.value}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            {status === 'sent' ? (
              <div style={{
                padding: '3rem 2rem', background: 'var(--green-faint)',
                border: '1px solid var(--green-muted)', borderRadius: '8px', textAlign: 'center',
              }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--green-primary)', marginBottom: '0.5rem' }}>Message sent</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>I&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { key: 'name', label: 'Name', type: 'text' },
                  { key: 'email', label: 'Email', type: 'email' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{
                      display: 'block', fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em',
                      textTransform: 'uppercase', marginBottom: '0.5rem',
                    }}>
                      {field.label}
                    </label>
                    <input
                      required type={field.type} style={inputStyle}
                      value={form[field.key as 'name' | 'email']}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = 'var(--green-muted)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    />
                  </div>
                ))}
                <div>
                  <label style={{
                    display: 'block', fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em',
                    textTransform: 'uppercase', marginBottom: '0.5rem',
                  }}>
                    Message
                  </label>
                  <textarea
                    required rows={6} style={{ ...inputStyle, resize: 'vertical' }}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = 'var(--green-muted)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <button type="submit" disabled={status === 'sending'} style={{
                  padding: '0.9rem 2rem', background: status === 'sending' ? 'var(--green-muted)' : 'var(--green-primary)',
                  color: '#0a0f0a', border: 'none', borderRadius: '4px',
                  fontSize: '0.95rem', fontWeight: 600, cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s', alignSelf: 'flex-start',
                }}>
                  {status === 'sending' ? 'Sending...' : 'Send message'}
                </button>
                {status === 'error' && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace" }}>
                    Something went wrong. Email barttedys@gmail.com directly.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            barttedys.nl
          </p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Model: YOLOv11x-seg · Data: PDOK Beeldmateriaal · Built with Next.js + Modal
          </p>
        </div>
      </div>
    </section>
  )
}