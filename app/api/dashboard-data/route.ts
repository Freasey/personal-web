import { NextResponse } from 'next/server'
import { loadDashboardData } from '@/features/dashboard/data/supabase.data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const isStringRecord = (value: unknown): value is Record<string, string> => {
  if (!value || typeof value !== 'object') return false
  for (const key of Object.keys(value)) {
    if (typeof (value as Record<string, unknown>)[key] !== 'string') return false
  }
  return true
}

export async function POST(request: Request) {
  let blobUrl: Record<string, string> | null = null

  try {
    const body = (await request.json()) as { blobUrl?: unknown }
    if (isStringRecord(body.blobUrl)) {
      blobUrl = body.blobUrl
    }
  } catch {
    blobUrl = null
  }

  const data = await loadDashboardData(blobUrl)
  return NextResponse.json(data)
}
