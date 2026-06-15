'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { MediaKind } from '../../types'

interface MediaProps {
  src?: string
  /** Asset kind from the DB. When absent, the file extension is used to detect video. */
  kind?: MediaKind | null
  alt: string
  /** Classes applied to the inline <img>/<video> element (e.g. "h-full w-full object-cover"). */
  className?: string
  /** Gradient classes for the placeholder shown when there is no media. */
  fallbackClass?: string
  /** Allow clicking to open the media full-screen. Defaults to true. */
  zoomable?: boolean
}

const VIDEO_EXTENSION = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i

const isVideo = (src: string, kind?: MediaKind | null) =>
  kind === 'video' || (kind == null && VIDEO_EXTENSION.test(src))

/** Full-screen overlay showing the media at its natural size. */
const Lightbox = ({
  src,
  video,
  alt,
  onClose,
}: {
  src: string
  video: boolean
  alt: string
  onClose: () => void
}) => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    // Lock background scroll while the overlay is open.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-sm transition hover:bg-black/60 hover:text-white cursor-pointer"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Stop propagation so clicks on the media itself don't close the overlay. */}
      <div onClick={(event) => event.stopPropagation()} className="flex items-center justify-center">
        {video ? (
          <video
            src={src}
            className="max-h-[88vh] max-w-[92vw] rounded-lg shadow-2xl"
            controls
            autoPlay
            playsInline
            loop
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="max-h-[88vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"
          />
        )}
      </div>
    </div>,
    document.body,
  )
}

/**
 * Renders project/skill media. Videos auto-play, are muted, loop forever, and
 * expose no controls inline (so they cannot be paused). Clicking the media
 * opens a full-screen lightbox; videos there gain full playback controls.
 * Falls back to a gradient placeholder when there is no source.
 */
export const Media = ({ src, kind, alt, className, fallbackClass, zoomable = true }: MediaProps) => {
  const [open, setOpen] = useState(false)

  if (!src) {
    return (
      <div
        className={`absolute inset-0 bg-linear-to-br ${fallbackClass ?? 'from-slate-900 via-slate-800 to-slate-700'}`}
      />
    )
  }

  const video = isVideo(src, kind)

  const inlineMedia = video ? (
    <video
      src={src}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      // No `controls` inline → the viewer cannot pause/seek here.
      disablePictureInPicture
      preload="metadata"
      aria-label={alt}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} />
  )

  if (!zoomable) {
    return inlineMedia
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt ? `Open ${alt}` : 'Open media'}
        title={alt}
        className="group absolute inset-0 h-full w-full cursor-zoom-in overflow-hidden"
      >
        {inlineMedia}

        {/* Hover affordance so users understand the media is clickable. */}
        <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/25" />
        <span className="pointer-events-none absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M9 4H5a1 1 0 0 0-1 1v4m11-5h4a1 1 0 0 1 1 1v4M9 20H5a1 1 0 0 1-1-1v-4m11 5h4a1 1 0 0 0 1-1v-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>

      {open && <Lightbox src={src} video={video} alt={alt} onClose={() => setOpen(false)} />}
    </>
  )
}
