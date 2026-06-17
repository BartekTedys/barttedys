'use client'
import { useState, useEffect } from 'react'

const links = [
  { label: 'Demo', href: '#demo' },
  { label: 'City Map', href: '#citymap' },
  { label: 'Research', href: '#research' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu on link click
  const handleLinkClick = () => setMenuOpen(false)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 2000,
        padding: '0 clamp(1.5rem, 5vw, 4rem)',
        height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled || menuOpen ? 'rgba(10, 15, 10, 0.98)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid #1e2e1e' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <a href="#" style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.85rem', color: 'var(--green-primary)',
          textDecoration: 'none', letterSpacing: '0.05em', fontWeight: 400,
        }}>
          bart<span style={{ color: 'var(--text-secondary)' }}>tedys</span>
          <span style={{ color: 'var(--green-primary)' }}>.nl</span>
        </a>

        {/* Desktop nav */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {links.map(l => (
              <a key={l.href} href={l.href} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.85rem', color: 'var(--text-secondary)',
                textDecoration: 'none', letterSpacing: '0.03em', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--green-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {l.label}
              </a>
            ))}
            <a href="#contact" style={{
              padding: '0.4rem 1rem', background: 'transparent',
              border: '1px solid var(--green-primary)', color: 'var(--green-primary)',
              borderRadius: '4px', fontSize: '0.8rem', textDecoration: 'none',
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-primary)'; e.currentTarget.style.color = '#0a0f0a' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--green-primary)' }}
            >
              hire me
            </a>
          </div>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.5rem', color: 'var(--green-primary)',
              display: 'flex', flexDirection: 'column', gap: '5px',
            }}
            aria-label="Toggle menu"
          >
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: 'var(--green-primary)',
              transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
              transition: 'transform 0.2s',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: 'var(--green-primary)',
              opacity: menuOpen ? 0 : 1,
              transition: 'opacity 0.2s',
            }} />
            <span style={{
              display: 'block', width: '22px', height: '2px',
              background: 'var(--green-primary)',
              transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              transition: 'transform 0.2s',
            }} />
          </button>
        )}
      </nav>

      {/* Mobile dropdown menu */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 1999,
          background: 'rgba(10,15,10,0.98)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          maxHeight: menuOpen ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}>
          <div style={{ padding: '1rem clamp(1.5rem, 5vw, 4rem) 1.5rem', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={handleLinkClick} style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.1rem', color: 'var(--text-secondary)',
                textDecoration: 'none', padding: '0.85rem 0',
                borderBottom: '1px solid var(--border)',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--green-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {l.label}
              </a>
            ))}
            <a href="#contact" onClick={handleLinkClick} style={{
              marginTop: '1rem', padding: '0.75rem 1.5rem',
              background: 'var(--green-primary)', color: '#0a0f0a',
              borderRadius: '4px', fontSize: '0.95rem', fontWeight: 600,
              textDecoration: 'none', textAlign: 'center',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              hire me
            </a>
          </div>
        </div>
      )}
    </>
  )
}
