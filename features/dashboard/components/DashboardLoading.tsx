import { UI, type Locale } from '../i18n'

interface DashboardLoadingProps {
  locale: Locale
}

/** Full-width loading state shown while the dashboard content is fetched. */
export const DashboardLoading = ({ locale }: DashboardLoadingProps) => {
  const t = UI[locale]

  return (
    <div className="w-full max-w-[1200px] flex items-center justify-center min-h-[585px]">
      <div className="relative overflow-hidden backdrop-blur-2xl bg-black/20 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl px-10 sm:px-16 py-14 sm:py-16 flex flex-col items-center gap-7 text-white">
        {/* Soft ambient glow behind the content. */}
        <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_60%)]" />

        {/* Dual-ring spinner: a static track + a rotating arc. */}
        <div className="relative h-16 w-16">
          <span className="absolute inset-0 rounded-full border-2 border-white/10" />
          <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/90 border-r-white/40 animate-spin" />
        </div>

        <div className="relative flex flex-col items-center gap-2 text-center">
          <p className="text-base sm:text-lg font-medium tracking-wide" role="status" aria-live="polite">
            {t.loading}
          </p>
          <p className="text-xs sm:text-sm text-white/50">{t.loadingHint}</p>

          {/* Three pulsing dots for a subtle sense of progress. */}
          <div className="mt-2 flex items-center gap-1.5" aria-hidden>
            <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
