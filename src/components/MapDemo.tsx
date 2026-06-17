'use client'
import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@/lib/useIsMobile'

type MapStage = 'idle' | 'selected' | 'fetching' | 'done' | 'error'

export default function MapDemo() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const drawnLayerRef = useRef<unknown>(null)
  const [mapReady, setMapReady] = useState(false)
  const [mapStage, setMapStage] = useState<MapStage>('idle')
  const [mapResult, setMapResult] = useState<{ image: string; stats: Record<string, string | number> } | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [selectedBounds, setSelectedBounds] = useState<[number, number, number, number] | null>(null)
  const [selectMode, setSelectMode] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!mapRef.current) return

    let map: L.Map

    const initMap = async () => {
      const L = (await import('leaflet')).default

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const container = mapRef.current as any
      if (container._leaflet_id) container._leaflet_id = null
      if (mapInstanceRef.current) {
        try { (mapInstanceRef.current as L.Map).remove() } catch (_) {}
        mapInstanceRef.current = null
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      map = L.map(mapRef.current!, {
        center: [51.9693, 5.6655],
        zoom: 16,
        zoomControl: true,
        attributionControl: true,
      })

      mapInstanceRef.current = map

      L.tileLayer(
        'https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/2020_ortho25/EPSG:3857/{z}/{x}/{y}.jpeg',
        { attribution: '© PDOK / Beeldmateriaal.nl', maxZoom: 21, tileSize: 256 }
      ).addTo(map)

      setMapReady(true)

      // Load Wageningen GeoJSON overlay
      fetch('/wageningen-canopy.geojson')
        .then(r => r.json())
        .then(data => {
          L.geoJSON(data, {
            style: { color: '#4ade80', weight: 1, fillColor: '#4ade80', fillOpacity: 0.35 },
          }).addTo(map)
        })
        .catch(() => {})

      // Desktop mouse draw
      let startLatLng: L.LatLng | null = null
      let drawing = false

      map.on('mousedown', (e: L.LeafletMouseEvent) => {
        startLatLng = e.latlng
        drawing = true
        map.dragging.disable()
        if (drawnLayerRef.current) { map.removeLayer(drawnLayerRef.current as L.Layer); drawnLayerRef.current = null }
      })
      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        if (!drawing || !startLatLng) return
        if (drawnLayerRef.current) map.removeLayer(drawnLayerRef.current as L.Layer)
        drawnLayerRef.current = L.rectangle(L.latLngBounds(startLatLng, e.latlng), {
          color: '#4ade80', weight: 2, fillColor: '#4ade80', fillOpacity: 0.1, dashArray: '5 5',
        }).addTo(map)
      })
      map.on('mouseup', (e: L.LeafletMouseEvent) => {
        if (!drawing || !startLatLng) return
        drawing = false
        map.dragging.enable()
        const bounds = L.latLngBounds(startLatLng, e.latlng)
        const sw = bounds.getSouthWest(); const ne = bounds.getNorthEast()
        if (Math.abs(ne.lat - sw.lat) * Math.abs(ne.lng - sw.lng) < 0.000001) return
        setSelectedBounds([sw.lng, sw.lat, ne.lng, ne.lat])
        setMapStage('selected')
      })

      // Mobile touch draw - only active when selectMode is true
      // We use a ref so the handler always reads current selectMode
      const selectModeRef = { current: false }

      // Expose setter so React state changes can update it
      ;(map as unknown as { _selectModeRef: { current: boolean } })._selectModeRef = selectModeRef

      let touchStart: L.LatLng | null = null

      const mapContainer = map.getContainer()

      mapContainer.addEventListener('touchstart', (e: TouchEvent) => {
        if (!selectModeRef.current) return
        e.preventDefault()
        map.dragging.disable()
        const touch = e.touches[0]
        const rect = mapContainer.getBoundingClientRect()
        const point = L.point(touch.clientX - rect.left, touch.clientY - rect.top)
        touchStart = map.containerPointToLatLng(point)
        if (drawnLayerRef.current) { map.removeLayer(drawnLayerRef.current as L.Layer); drawnLayerRef.current = null }
      }, { passive: false })

      mapContainer.addEventListener('touchmove', (e: TouchEvent) => {
        if (!selectModeRef.current || !touchStart) return
        e.preventDefault()
        const touch = e.touches[0]
        const rect = mapContainer.getBoundingClientRect()
        const point = L.point(touch.clientX - rect.left, touch.clientY - rect.top)
        const current = map.containerPointToLatLng(point)
        if (drawnLayerRef.current) map.removeLayer(drawnLayerRef.current as L.Layer)
        drawnLayerRef.current = L.rectangle(L.latLngBounds(touchStart, current), {
          color: '#4ade80', weight: 2, fillColor: '#4ade80', fillOpacity: 0.1, dashArray: '5 5',
        }).addTo(map)
      }, { passive: false })

      mapContainer.addEventListener('touchend', (e: TouchEvent) => {
        if (!selectModeRef.current || !touchStart) return
        e.preventDefault()
        map.dragging.enable()
        const touch = e.changedTouches[0]
        const rect = mapContainer.getBoundingClientRect()
        const point = L.point(touch.clientX - rect.left, touch.clientY - rect.top)
        const end = map.containerPointToLatLng(point)
        const bounds = L.latLngBounds(touchStart, end)
        const sw = bounds.getSouthWest(); const ne = bounds.getNorthEast()
        touchStart = null
        if (Math.abs(ne.lat - sw.lat) * Math.abs(ne.lng - sw.lng) < 0.000001) return
        setSelectedBounds([sw.lng, sw.lat, ne.lng, ne.lat])
        setMapStage('selected')
        setSelectMode(false)
      }, { passive: false })
    }

    initMap()
    return () => {
      if (mapInstanceRef.current) {
        try { (mapInstanceRef.current as L.Map).remove() } catch (_) {}
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Sync selectMode into the map's ref so touch handlers can read it
  useEffect(() => {
    if (!mapInstanceRef.current) return
    const map = mapInstanceRef.current as unknown as { _selectModeRef?: { current: boolean } }
    if (map._selectModeRef) map._selectModeRef.current = selectMode
    const leafletMap = mapInstanceRef.current as L.Map
    if (selectMode) {
      leafletMap.dragging.disable()
    } else {
      leafletMap.dragging.enable()
    }
  }, [selectMode])

  const runOnSelection = async () => {
    if (!selectedBounds) return
    setMapStage('fetching')
    setMapError(null)
    try {
      const res = await fetch('/api/infer-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedBounds),
      })
      if (!res.ok) throw new Error(await res.text())
      setMapResult(await res.json())
      setMapStage('done')
    } catch (e: unknown) {
      setMapError(e instanceof Error ? e.message : 'Failed')
      setMapStage('error')
    }
  }

  const resetMap = () => {
    if (mapInstanceRef.current && drawnLayerRef.current) {
      (mapInstanceRef.current as L.Map).removeLayer(drawnLayerRef.current as L.Layer)
      drawnLayerRef.current = null
    }
    setMapStage('idle')
    setMapResult(null)
    setMapError(null)
    setSelectedBounds(null)
    setSelectMode(false)
  }

  return (
    <section id="citymap" style={{
      padding: '8rem clamp(2rem, 6vw, 8rem)',
      maxWidth: '1400px', margin: '0 auto', width: '100%', scrollMarginTop: '60px',
    }}>
      <div style={{ marginBottom: '3rem' }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem',
          color: 'var(--green-primary)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem',
        }}>
          Live map · PDOK aerial tiles
        </p>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700,
          letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '1rem',
        }}>
          Select a region
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '560px', fontWeight: 300 }}>
          {isMobile
            ? 'Pan and zoom to the area you want, then tap "Draw selection" and drag to mark it.'
            : 'Zoom in to street level first, then drag to draw a small bounding box. Keep your selection to a few city blocks for best results.'}
        </p>
      </div>

      <div style={{
        border: '1px solid var(--border)', borderRadius: '8px',
        overflow: 'hidden', position: 'relative', background: '#0d150d',
      }}>
        <div
          ref={mapRef}
          style={{
            height: 'clamp(400px, 60vh, 650px)', width: '100%',
            cursor: isMobile ? (selectMode ? 'crosshair' : 'grab') : 'crosshair',
          }}
        />

        {!mapReady && (
          <div style={{
            position: 'absolute', inset: 0, background: '#0d150d',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
          }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              Initialising map...
            </p>
          </div>
        )}

        {/* Mobile mode toggle */}
        {mapReady && isMobile && mapStage === 'idle' && (
          <div style={{
            position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 500, display: 'flex', gap: '0.5rem',
          }}>
            <button
              onClick={() => setSelectMode(s => !s)}
              style={{
                padding: '0.6rem 1.25rem',
                background: selectMode ? 'var(--green-primary)' : 'rgba(10,15,10,0.92)',
                color: selectMode ? '#0a0f0a' : 'var(--text-secondary)',
                border: `1px solid ${selectMode ? 'var(--green-primary)' : 'var(--border)'}`,
                borderRadius: '4px', fontSize: '0.85rem', fontWeight: selectMode ? 600 : 400,
                cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace",
                whiteSpace: 'nowrap',
              }}
            >
              {selectMode ? '✕ Cancel' : '+ Draw selection'}
            </button>
          </div>
        )}

        {/* Desktop instruction badge */}
        {mapReady && !isMobile && mapStage === 'idle' && (
          <div style={{
            position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 500, background: 'rgba(10,15,10,0.92)', border: '1px solid var(--border)',
            borderRadius: '4px', padding: '0.5rem 1rem', backdropFilter: 'blur(8px)',
            maxWidth: 'calc(100% - 80px)', textAlign: 'center',
          }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'normal' }}>
              Zoom in first, then click and drag to select a small area
            </p>
          </div>
        )}

        {/* Mobile select mode active hint */}
        {mapReady && isMobile && selectMode && (
          <div style={{
            position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 500, background: 'rgba(10,15,10,0.92)', border: '1px solid var(--green-primary)',
            borderRadius: '4px', padding: '0.5rem 1rem', backdropFilter: 'blur(8px)',
            maxWidth: 'calc(100% - 80px)', textAlign: 'center',
          }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--green-primary)', whiteSpace: 'normal' }}>
              Drag to draw your selection
            </p>
          </div>
        )}

        {mapStage === 'selected' && (
          <div style={{
            position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 500, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <button onClick={runOnSelection} style={{
              padding: '0.6rem 1.5rem', background: 'var(--green-primary)', color: '#0a0f0a',
              border: 'none', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            }}>
              Analyse selection →
            </button>
            <button onClick={resetMap} style={{
              padding: '0.6rem 1rem', background: 'rgba(10,15,10,0.92)',
              color: 'var(--text-secondary)', border: '1px solid var(--border)',
              borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer',
            }}>
              Clear
            </button>
          </div>
        )}

        {mapStage === 'fetching' && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(10,15,10,0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 500, backdropFilter: 'blur(4px)',
          }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <div style={{
              width: '36px', height: '36px', border: '2px solid var(--border)',
              borderTop: '2px solid var(--green-primary)', borderRadius: '50%',
              animation: 'spin 1s linear infinite', marginBottom: '1rem',
            }} />
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Fetching PDOK tiles and running inference...
            </p>
          </div>
        )}
      </div>

      {mapStage === 'done' && mapResult && (
        <div style={{
          marginTop: '1.5rem', border: '1px solid var(--border)',
          borderRadius: '8px', background: 'var(--surface)', padding: '2rem',
        }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Detection result
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/png;base64,${mapResult.image}`} alt="result"
            style={{ width: '100%', borderRadius: '4px', border: '1px solid var(--green-primary)', marginBottom: '1rem' }} />
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {Object.entries(mapResult.stats).map(([k, v]) => (
              <div key={k}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: 'var(--green-primary)', marginBottom: '0.2rem' }}>{String(v)}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
          <button onClick={resetMap} style={{
            marginTop: '1rem', padding: '0.4rem 1rem', border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-secondary)', borderRadius: '4px',
            cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem',
          }}>
            Select another area
          </button>
        </div>
      )}

      {mapStage === 'error' && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '4px' }}>
          <p style={{ color: '#ef4444', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>{mapError}</p>
          <button onClick={resetMap} style={{ marginTop: '0.5rem', color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>Try again</button>
        </div>
      )}
    </section>
  )
}