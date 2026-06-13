import type { ProfileData } from '../../types'
import { UI, type Locale } from '../../i18n'
import { FadeSection } from '../ui/FadeSection'

interface BioViewProps {
  profile: ProfileData
  locale: Locale
  onBack: () => void
}

export const BioView = ({ profile, locale, onBack }: BioViewProps) => {
  const t = UI[locale]
  return (
    <FadeSection className="w-full h-full rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 overflow-y-auto">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/60">{t.portfolioBio}</p>
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 text-xs text-white/70 hover:text-white border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 transition cursor-pointer"
        >
          {t.backToMenu}
        </button>
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold mt-3 sm:mt-4">{profile.name}</h1>
      <p className="text-base sm:text-lg text-white/80 mt-1 sm:mt-2">{profile.role}</p>
      <p className="text-sm sm:text-base text-white/70 mt-3 sm:mt-4 leading-relaxed">{profile.summary}</p>

      <div className="mt-5 sm:mt-6 grid grid-cols-2 sm:block gap-4">
        <div>
          <p className="text-xs sm:text-sm text-white/60">{t.location}</p>
          <p className="text-sm sm:text-base">{profile.location}</p>
        </div>
        <div className="sm:mt-4">
          <p className="text-xs sm:text-sm text-white/60">{t.availability}</p>
          <p className="text-sm sm:text-base">{profile.availability}</p>
        </div>
      </div>

      <div className="mt-5 sm:mt-6">
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/60">{t.highlights}</p>
        <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-sm text-white/80">
          {profile.highlights.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-white/40">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 sm:mt-6">
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/60">{t.coreSkills}</p>
        <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] sm:text-xs bg-white/10 text-white/80 px-2.5 sm:px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 sm:mt-6">
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/60">{t.experience}</p>
        <div className="mt-3 sm:mt-4 space-y-4">
          {profile.experience.map((role) => (
            <div key={role.role}>
              <p className="text-sm font-semibold text-white">{role.role}</p>
              <p className="text-xs text-white/60">{role.company}</p>
              <p className="text-xs text-white/60">{role.period}</p>
              <p className="text-xs text-white/80 mt-2 leading-relaxed">{role.details}</p>
            </div>
          ))}
        </div>
      </div>
    </FadeSection>
  )
}
