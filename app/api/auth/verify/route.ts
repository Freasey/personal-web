import { NextResponse } from 'next/server'
import { verifyTotp } from '@/lib/auth/totp'
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionCookie,
} from '@/lib/auth/session'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const secret = process.env.TOTP_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'Server is missing TOTP_SECRET configuration.' },
      { status: 500 },
    )
  }

  let body: { code?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const code = typeof body.code === 'string' ? body.code : ''
  if (!code) {
    return NextResponse.json({ error: 'Code is required.' }, { status: 400 })
  }

  const isValid = verifyTotp({ secret, token: code })
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid code.' }, { status: 401 })
  }

  const sessionValue = await createSessionCookie()
  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return response
}
