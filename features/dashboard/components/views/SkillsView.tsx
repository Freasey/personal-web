import type { WheelEvent } from 'react'
import type { SkillItem } from '../../types'
import { UI, type Locale } from '../../i18n'
import { FadeSection } from '../ui/FadeSection'
import { Media } from '../ui/Media'

interface SkillsViewProps {
  skills: SkillItem[]
  locale: Locale
  onBack: () => void
}

export const SkillsView = ({ skills, locale, onBack }: SkillsViewProps) => {
  const t = UI[locale]
  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    const container = event.currentTarget
    const hasHorizontalOverflow = container.scrollWidth > container.clientWidth

    if (!hasHorizontalOverflow || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return
    }

    event.preventDefault()
    container.scrollLeft += event.deltaY
  }

  return (
    <FadeSection className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/60">{t.skillsExpertise}</p>
          <h2 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">{t.capabilities}</h2>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 text-xs text-white/70 hover:text-white border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 transition cursor-pointer"
        >
          {t.backToMenu}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 overflow-y-auto lg:overflow-x-auto pb-2" onWheel={handleWheel}>
        {skills.map((skill) => (
          <article
            key={skill.id}
            className="w-full lg:min-w-[420px] lg:max-w-[420px] rounded-2xl border border-white/10 bg-black/30 overflow-hidden flex lg:block flex-col"
          >
            <div className="h-40 sm:h-56 relative shrink-0">
              <Media
                src={skill.image}
                kind={skill.imageKind}
                alt={skill.name}
                className="h-full w-full object-cover"
                fallbackClass={skill.bgClass}
              />
            </div>
            <div className="p-4 sm:p-5">
              <p className="text-base sm:text-lg font-semibold">{skill.name}</p>
              <p className="text-sm text-white/70 mt-2 leading-relaxed">{skill.description}</p>
            </div>
          </article>
        ))}
      </div>
    </FadeSection>
  )
}
