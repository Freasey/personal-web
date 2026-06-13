import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { recordVisit } from '@/lib/visits'

export const runtime = 'nodejs'

const VISITOR_COOKIE_NAME = 'visitor_id'
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

/** Best-effort client IP from common proxy headers (Vercel sets x-forwarded-for). */
const readClientIp = (headers: Headers): string | null => {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip') ?? null
}

export async function POST(request: Request) {
  let body: { path?: unknown; referrer?: unknown } = {}
  try {
    body = await request.json()
  } catch {
    // empty/invalid body is fine — fall back to header-derived values
  }

  const headers = request.headers
  const cookieHeader = headers.get('cookie') ?? ''
  const existing = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${VISITOR_COOKIE_NAME}=`))

  const isNew = !existing
  const visitorId = existing
    ? decodeURIComponent(existing.slice(VISITOR_COOKIE_NAME.length + 1))
    : randomUUID()

  const path = typeof body.path === 'string' ? body.path : null
  const referrer =
    typeof body.referrer === 'string' && body.referrer ? body.referrer : headers.get('referer')

  try {
    await recordVisit({
      visitorId,
      ipAddress: readClientIp(headers),
      userAgent: headers.get('user-agent'),
      path,
      referrer,
      country: headers.get('x-vercel-ip-country'),
      city: headers.get('x-vercel-ip-city'),
      isNew,
    })
  } catch {
    // never let tracking break the page
  }

  const response = NextResponse.json({ ok: true })
  if (isNew) {
    response.cookies.set({
      name: VISITOR_COOKIE_NAME,
      value: visitorId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: VISITOR_COOKIE_MAX_AGE,
    })
  }
  return response
}
