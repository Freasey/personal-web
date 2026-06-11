'use client'

import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'

export type MediaKind = 'image' | 'video'

export interface MediaPickerValue {
  id: string | null
  url: string | null
  kind: MediaKind | null
}

interface MediaPickerProps {
  label: string
  value: MediaPickerValue
  onChange: (next: MediaPickerValue) => void
  accept?: 'image' | 'video' | 'both'
}

const ACCEPT_MAP: Record<NonNullable<MediaPickerProps['accept']>, string> = {
  image: 'image/jpeg,image/png,image/webp',
  video: 'video/mp4',
  both: 'image/jpeg,image/png,image/webp,video/mp4',
}

const MAX_BYTES = 100 * 1024 * 1024 // 100MB hard cap (match bucket setting)

const inferKind = (file: File): MediaKind | null => {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  return null
}

export const MediaPicker = ({
  label,
  value,
  onChange,
  accept = 'both',
}: MediaPickerProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePick = () => inputRef.current?.click()

  const handleClear = () => {
    onChange({ id: null, url: null, kind: null })
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    const kind = inferKind(file)
    if (!kind) {
      setError('Tipe file tidak didukung.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`File terlalu besar (max ${Math.round(MAX_BYTES / 1024 / 1024)} MB).`)
      return
    }

    setIsUploading(true)
    setProgress('Mengunggah file…')
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        contentType: file.type,
        handleUploadUrl: '/api/dashboard/assets/upload',
      })

      setProgress('Mencatat asset…')
      const finalizeRes = await fetch('/api/dashboard/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          fileName: file.name,
          storagePath: blob.pathname,
          publicUrl: blob.url,
        }),
      })
      if (!finalizeRes.ok) {
        const data = (await finalizeRes.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `Finalize gagal (${finalizeRes.status}).`)
      }
      const asset = (await finalizeRes.json()) as {
        id: string
        public_url: string
        kind: MediaKind
      }

      onChange({ id: asset.id, url: asset.public_url, kind: asset.kind })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error.')
    } finally {
      setIsUploading(false)
      setProgress(null)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-[0.18em] text-white/50">{label}</span>
      <div className="flex items-stretch gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-black/40">
          {value.url ? (
            value.kind === 'video' ? (
              <video
                src={value.url}
                className="size-full object-cover"
                preload="metadata"
                muted
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value.url}
                alt=""
                className="size-full object-cover"
              />
            )
          ) : (
            <div className="flex size-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-white/30">
              Empty
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePick}
              disabled={isUploading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? 'Memproses…' : value.id ? 'Ganti file' : 'Pilih file'}
            </button>
            {value.id && !isUploading && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white/60 transition hover:border-rose-500/30 hover:text-rose-200"
              >
                Hapus
              </button>
            )}
          </div>
          <p className="text-[11px] text-white/40">
            {progress ?? (value.id ? value.kind?.toUpperCase() : 'JPG/PNG/WebP atau MP4 (≤100MB).')}
          </p>
          {error && <p className="text-[11px] text-rose-300">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
