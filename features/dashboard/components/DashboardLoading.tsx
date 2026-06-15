import { UI, type Locale } from '../i18n'

interface DashboardLoadingProps {
  locale: Locale
}

/** Full-width loading state shown while the dashboard content is fetched. */
export const DashboardLoading = ({ locale }: DashboardLoadingProps) => {
  const t = UI[locale]

  return (
    <div className="w-full max-w-[1200px] flex items-center justify-center min-h-[585px]">
      <div className="backdrop-blur-2xl bg-black/20 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl px-10 py-12 flex flex-col items-center gap-4 text-white">
        <span
          aria-hidden
          className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white animate-spin"
        />
        <p className="text-sm text-white/70" role="status" aria-live="polite">
          {t.loading}
        </p>
      </div>
    </div>
  )
}
