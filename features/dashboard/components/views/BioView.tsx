import type { ProfileData } from '../../types'
import { FadeSection } from '../ui/FadeSection'

interface BioViewProps {
  profile: ProfileData
  onBack: () => void
}

export const BioView = ({ profile, onBack }: BioViewProps) => {
  return (
    <FadeSection className="w-full h-full rounded-2xl border border-white/10 bg-white/5 p-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Portfolio Bio</p>
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-white/70 hover:text-white border border-white/20 rounded-full px-4 py-2 transition cursor-pointer"
        >
          Back to menu
        </button>
      </div>
      <h1 className="text-3xl font-bold mt-4">{profile.name}</h1>
      <p className="text-lg text-white/80 mt-2">{profile.role}</p>
      <p className="text-white/70 mt-4 leading-relaxed">{profile.summary}</p>

      <div className="mt-6">
        <p className="text-sm text-white/60">Location</p>
        <p className="text-base">{profile.location}</p>
        <p className="text-sm text-white/60 mt-4">Availability</p>
        <p className="text-base">{profile.availability}</p>
      </div>

      <div className="mt-6">
        <p className="text-sm uppercase tracking-[0.2em] text-white/60">Highlights</p>
        <ul className="mt-4 space-y-3 text-sm text-white/80">
          {profile.highlights.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-white/40">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <p className="text-sm uppercase tracking-[0.2em] text-white/60">Core Skills</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs bg-white/10 text-white/80 px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm uppercase tracking-[0.2em] text-white/60">Experience</p>
        <div className="mt-4 space-y-4">
          {profile.experience.map((role) => (
            <div key={role.role}>
              <p className="text-sm font-semibold text-white">{role.role}</p>
              <p className="text-xs text-white/60">{role.company}</p>
              <p className="text-xs text-white/60">{role.period}</p>
              <p className="text-xs text-white/80 mt-2">{role.details}</p>
            </div>
          ))}
        </div>
      </div>
    </FadeSection>
  )
}
