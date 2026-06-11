import { NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { requireDashboardSession } from '@/lib/auth/guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
]
const MAX_BYTES = 100 * 1024 * 1024 // 100MB

// Issues short-lived client-upload tokens for Vercel Blob. The browser uploads
// the file directly to Blob with this token, bypassing the 4.5MB route-body
// limit (required for videos up to 100MB).
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async () => {
        const authorized = await requireDashboardSession()
        if (!authorized) {
          throw new Error('Unauthorized.')
        }
        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        }
      },
      // Fires via webhook on deployed environments only (not localhost). The
      // asset row is recorded by the client via POST /api/dashboard/assets
      // after upload resolves, so nothing is needed here.
      onUploadCompleted: async () => {},
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload token error.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
