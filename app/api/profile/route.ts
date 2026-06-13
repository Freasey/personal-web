import { NextResponse } from 'next/server'
import { requireDashboardSession } from '@/lib/auth/guard'
import { saveProfile } from '@/features/dashboard/data/profile.write'
import { parseProfileInput } from '@/features/dashboard/data/profile.input'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PUT(request: Request) {
  const authorized = await requireDashboardSession()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const input = parseProfileInput(body)
  if (!input) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  }

  try {
    await saveProfile(input)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
