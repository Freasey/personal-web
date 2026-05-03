import type { WheelEvent } from 'react'
import type { SkillItem } from '../../types'
import { FadeSection } from '../ui/FadeSection'

interface SkillsViewProps {
  skills: SkillItem[]
  onBack: () => void
}

export const SkillsView = ({ skills, onBack }: SkillsViewProps) => {
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
    <FadeSection className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Skills & Expertise</p>
          <h2 className="text-2xl font-bold mt-2">Capabilities</h2>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-white/70 hover:text-white border border-white/20 rounded-full px-4 py-2 transition cursor-pointer"
        >
          Back to menu
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 overflow-y-auto lg:overflow-x-auto pb-2" onWheel={handleWheel}>
        {skills.map((skill) => (
          <article
            key={skill.id}
            className="w-full lg:min-w-[420px] lg:max-w-[420px] rounded-2xl border border-white/10 bg-black/30 overflow-hidden flex lg:block flex-col"
          >
            <div className="h-40 sm:h-56 relative shrink-0">
              {skill.image ? (
                <img src={skill.image} alt={skill.name} className="h-full w-full object-cover" />
              ) : (
                <div
                  className={`absolute inset-0 bg-linear-to-br ${skill.bgClass ?? 'from-slate-900 via-slate-800 to-slate-700'}`}
                />
              )}
            </div>
            <div className="p-5">
              <p className="text-lg font-semibold">{skill.name}</p>
              <p className="text-sm text-white/70 mt-2 leading-relaxed">{skill.description}</p>
            </div>
          </article>
        ))}
      </div>
    </FadeSection>
  )
}
