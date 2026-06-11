import { NextResponse } from 'next/server'
import { requireDashboardSession } from '@/lib/auth/guard'
import {
  createAssetRow,
  type AssetKind,
} from '@/features/dashboard/data/assets.write'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const isAssetKind = (value: unknown): value is AssetKind =>
  value === 'image' || value === 'video'

const asString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

export async function POST(request: Request) {
  const authorized = await requireDashboardSession()
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  let body: { kind?: unknown; fileName?: unknown; storagePath?: unknown; publicUrl?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!isAssetKind(body.kind)) {
    return NextResponse.json(
      { error: "Body 'kind' must be 'image' or 'video'." },
      { status: 400 },
    )
  }

  const fileName = asString(body.fileName)
  const storagePath = asString(body.storagePath)
  const publicUrl = asString(body.publicUrl)
  if (!fileName || !storagePath || !publicUrl) {
    return NextResponse.json(
      { error: "Fields 'fileName', 'storagePath', 'publicUrl' are required." },
      { status: 400 },
    )
  }

  try {
    const asset = await createAssetRow({
      kind: body.kind,
      fileName,
      storagePath,
      publicUrl,
    })
    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
