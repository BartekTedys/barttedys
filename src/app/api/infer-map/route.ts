import { NextRequest, NextResponse } from 'next/server'

const MODAL_URL = process.env.MODAL_INFER_MAP_URL
export const maxDuration = 60

const rateLimitMap = new Map<string, { count: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)
  if (!limit || now > limit.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 })
    return true
  }
  if (limit.count >= 5) return false
  limit.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests — please wait a minute.' }, { status: 429 })
  }

  if (!MODAL_URL) {
    return NextResponse.json({ error: 'Inference backend not configured' }, { status: 503 })
  }

  try {
    const bbox = await req.json()
    if (!bbox || bbox.length !== 4) {
      return NextResponse.json({ error: 'bbox must be [minLng, minLat, maxLng, maxLat]' }, { status: 400 })
    }

    const res = await fetch(MODAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Token': process.env.API_SECRET_TOKEN || '',
      },
      body: JSON.stringify(bbox),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: text }, { status: res.status })
    }

    return NextResponse.json(await res.json())
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}