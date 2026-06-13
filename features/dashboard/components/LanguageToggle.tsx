'use client'

import type { Locale } from '../i18n'

interface LanguageToggleProps {
  locale: Locale
  onChange: (locale: Locale) => void
  className?: string
}

const OPTIONS: { value: Locale; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'id', label: 'ID' },
]

export const LanguageToggle = ({ locale, onChange, className = '' }: LanguageToggleProps) => (
  <div
    role="group"
    aria-label="Language"
    className={`inline-flex items-center gap-0.5 rounded-full border border-white/15 bg-black/30 p-0.5 backdrop-blur-md ${className}`}
  >
    {OPTIONS.map((option) => {
      const active = option.value === locale
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={active}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition cursor-pointer ${
            active
              ? 'bg-white/90 text-slate-900'
              : 'text-white/60 hover:text-white'
          }`}
        >
          {option.label}
        </button>
      )
    })}
  </div>
)
