import 'server-only'

import { del } from '@vercel/blob'
import { getSql } from '@/lib/db'

export type AssetKind = 'image' | 'video'

export interface AssetRow {
  id: string
  kind: AssetKind
  file_name: string
  public_url: string
  storage_path: string
}

export interface CreateAssetInput {
  kind: AssetKind
  fileName: string
  /** Vercel Blob pathname (e.g. "images/uuid.png"). */
  storagePath: string
  /** Vercel Blob public URL. */
  publicUrl: string
}

// Records an already-uploaded Vercel Blob as an asset row in Neon.
export const createAssetRow = async (input: CreateAssetInput): Promise<AssetRow> => {
  const sql = getSql()
  const rows = (await sql`
    insert into assets (kind, file_name, storage_path, public_url)
    values (${input.kind}, ${input.fileName}, ${input.storagePath}, ${input.publicUrl})
    returning id, kind, file_name, storage_path, public_url
  `) as AssetRow[]

  if (!rows[0]) throw new Error('createAssetRow returned no row.')
  return rows[0]
}

// Removes the asset row and its underlying Vercel Blob object.
export const deleteAssetRow = async (id: string) => {
  const sql = getSql()
  const rows = (await sql`
    select public_url from assets where id = ${id}
  `) as Array<{ public_url: string }>

  await sql`delete from assets where id = ${id}`

  const publicUrl = rows[0]?.public_url
  if (publicUrl) {
    // Uses BLOB_READ_WRITE_TOKEN from the environment.
    await del(publicUrl).catch(() => {})
  }
}
