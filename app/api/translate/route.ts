import { NextResponse } from 'next/server'
import { requireDashboardSession } from '@/lib/auth/guard'
import {
  isTranslationConfigured,
  translateBatch,
  TranslateConfigError,
  type TranslateLocale,
} from '@/lib/translate'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const isLocale = (value: unknown): value is TranslateLocale =>
  value === 'en' || value === 'id'

export async function POST(request: Request) {
  const authorized = await requireDashboardSession()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  if (!isTranslationConfigured()) {
    return NextResponse.json(
      { error: 'Auto-translate is not configured. Set GEMINI_API_KEY to enable it.' },
      { status: 503 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const raw = (body ?? {}) as { texts?: unknown; from?: unknown; to?: unknown }
  if (
    !Array.isArray(raw.texts) ||
    !raw.texts.every((t) => typeof t === 'string') ||
    !isLocale(raw.from) ||
    !isLocale(raw.to)
  ) {
    return NextResponse.json(
      { error: 'Expected { texts: string[], from: "en"|"id", to: "en"|"id" }.' },
      { status: 400 },
    )
  }

  if (raw.from === raw.to) {
    return NextResponse.json({ translations: raw.texts })
  }

  if (raw.texts.length > 100) {
    return NextResponse.json({ error: 'Too many strings (max 100).' }, { status: 400 })
  }

  try {
    const translations = await translateBatch(raw.texts as string[], raw.from, raw.to)
    return NextResponse.json({ translations })
  } catch (error) {
    if (error instanceof TranslateConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }
    const message = error instanceof Error ? error.message : 'Translation failed.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
