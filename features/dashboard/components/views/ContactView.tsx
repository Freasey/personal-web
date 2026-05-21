import type { ContactItem } from '../../types'
import { FadeSection } from '../ui/FadeSection'

interface ContactViewProps {
  contacts: ContactItem[]
  onBack: () => void
}

export const ContactView = ({ contacts, onBack }: ContactViewProps) => {
  return (
    <FadeSection className="w-full flex flex-col rounded-2xl overflow-hidden border border-white/10">

      {/* ── Header ── */}
      <div className="relative bg-white/5 px-5 sm:px-8 pt-6 sm:pt-8 pb-8 sm:pb-10 overflow-hidden">
        {/* Watermark dekoratif */}
        <span className="pointer-events-none select-none absolute -right-2 -top-3 sm:-right-3 sm:-top-4 text-[6rem] sm:text-[11rem] font-black leading-none text-white/3">
          ✦
        </span>

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-3 sm:mb-4 text-[10px] uppercase tracking-[0.35em] sm:tracking-[0.45em] text-white/35">
              Contact
            </p>
            <h2 className="text-[1.75rem] sm:text-[2.2rem] lg:text-[2.6rem] font-black leading-[1.05]">
              Let's Build
              <br />
              <span className="text-white/30">Something</span>
              <br />
              Great.
            </h2>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="shrink-0 mt-1 rounded-full border border-white/15 px-3 py-1.5 sm:px-4 sm:py-2 text-xs text-white/45 transition-all duration-200 hover:border-white/30 hover:text-white cursor-pointer"
          >
            Back to menu
          </button>
        </div>

        {/* Garis bawah fade */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* ── Intro band ── */}
      <div className="flex items-center gap-4 sm:gap-5 border-b border-white/7 bg-white/2 px-5 sm:px-8 py-4 sm:py-5">
        <div className="h-9 sm:h-10 w-[3px] shrink-0 rounded-full bg-linear-to-b from-white/50 to-white/05" />
        <p className="text-xs sm:text-sm leading-relaxed text-white/60">
          Open to freelance projects, product collaborations, and full-time roles.
          Have an idea that needs design-to-code execution?{' '}
          <span className="text-white/90">Let's make it real.</span>
        </p>
      </div>

      {/* ── Contact rows ── */}
      <div className="divide-y divide-white/5">
        {contacts.map((item, index) => (
          <div
            key={item.id}
            className="group flex cursor-default items-center gap-3 sm:gap-5 bg-black/20 px-5 sm:px-8 py-4 sm:py-5 transition-colors duration-150 hover:bg-white/4"
          >
            {/* Nomor urut */}
            <span className="w-4 sm:w-5 shrink-0 font-mono text-[10px] text-white/20">
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Label + Value */}
            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
              <p className="text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-white/35">
                {item.label}
              </p>
              <p className="truncate text-[13px] sm:text-[15px] font-semibold text-white">
                {item.value}
              </p>
            </div>

            {/* Hint */}
            <p className="hidden shrink-0 text-right text-[11px] leading-snug text-white/25 sm:block max-w-[130px]">
              {item.hint}
            </p>

            {/* Arrow indicator */}
            <span className="text-white/10 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white/35">
              →
            </span>
          </div>
        ))}
      </div>

    </FadeSection>
  )
}