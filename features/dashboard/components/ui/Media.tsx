import type { MediaKind } from '../../types'

interface MediaProps {
  src?: string
  /** Asset kind from the DB. When absent, the file extension is used to detect video. */
  kind?: MediaKind | null
  alt: string
  /** Classes applied to the <img>/<video> element (e.g. "h-full w-full object-cover"). */
  className?: string
  /** Gradient classes for the placeholder shown when there is no media. */
  fallbackClass?: string
}

const VIDEO_EXTENSION = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?.*)?$/i

const isVideo = (src: string, kind?: MediaKind | null) =>
  kind === 'video' || (kind == null && VIDEO_EXTENSION.test(src))

/**
 * Renders project/skill media. Videos auto-play, are muted, loop forever, and
 * expose no controls (so they cannot be paused). Falls back to a gradient
 * placeholder when there is no source.
 */
export const Media = ({ src, kind, alt, className, fallbackClass }: MediaProps) => {
  if (!src) {
    return (
      <div
        className={`absolute inset-0 bg-linear-to-br ${fallbackClass ?? 'from-slate-900 via-slate-800 to-slate-700'}`}
      />
    )
  }

  if (isVideo(src, kind)) {
    return (
      <video
        src={src}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        // No `controls` → the viewer cannot pause/seek.
        disablePictureInPicture
        preload="metadata"
        aria-label={alt}
      />
    )
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} />
}
