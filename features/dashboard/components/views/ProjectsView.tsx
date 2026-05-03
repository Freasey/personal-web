import { useState } from 'react'
import type { ProjectItem } from '../../types'
import { FadeSection } from '../ui/FadeSection'

interface ProjectsViewProps {
  projects: ProjectItem[]
  selectedProjectId: string | null
  onSelectProject: (id: string) => void
  onBack: () => void
}

export const ProjectsView = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onBack
}: ProjectsViewProps) => {
  const [showDetailMobile, setShowDetailMobile] = useState(false)
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? projects[0]

  return (
    <FadeSection className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Projects</p>
          <h2 className="text-2xl font-bold mt-2">Selected Work</h2>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-white/70 hover:text-white border border-white/20 rounded-full px-4 py-2 transition cursor-pointer"
        >
          Back to menu
        </button>
      </div>

      <div className={`flex flex-col lg:flex-row gap-4 lg:overflow-x-auto pb-2 ${showDetailMobile ? 'hidden lg:flex' : 'flex'}`}>
        {projects.map((project) => (
          <article
            key={project.id}
            className={`w-full lg:min-w-[260px] lg:max-w-[260px] shrink-0 rounded-2xl border ${
              project.id === selectedProject?.id ? 'border-white/40' : 'border-white/10'
            } bg-black/30 overflow-hidden flex flex-col`}
          >
            <div className="h-36 relative">
              {project.image ? (
                <img src={project.image} alt={project.name} className="h-full w-full object-cover" />
              ) : (
                <div
                  className={`absolute inset-0 bg-linear-to-br ${project.bgClass ?? 'from-slate-900 via-slate-800 to-slate-700'}`}
                />
              )}
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
              <p className="text-sm font-semibold">{project.name}</p>
              <p className="text-xs text-white/70">{project.summary}</p>
              <button
                type="button"
                onClick={() => {
                  onSelectProject(project.id)
                  setShowDetailMobile(true)
                }}
                className="mt-auto text-xs text-white/80 hover:text-white border border-white/20 rounded-full px-3 py-2 transition cursor-pointer"
              >
                Detail Project
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className={`rounded-2xl border border-white/10 bg-black/30 px-6 py-5 ${showDetailMobile ? 'block' : 'hidden lg:block'}`}>
        <div className="flex justify-between items-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/60">Project Detail</p>
          <button
            type="button"
            onClick={() => setShowDetailMobile(false)}
            className="lg:hidden text-xs text-white/70 hover:text-white border border-white/20 rounded-full px-3 py-1 transition cursor-pointer"
          >
            ← Back to List
          </button>
        </div>
        <h3 className="text-2xl font-semibold mt-3">{selectedProject?.name}</h3>
        <p className="text-sm text-white/70 mt-2 leading-relaxed">{selectedProject?.description}</p>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Gallery</p>
          <div className="mt-3 flex flex-col lg:flex-row gap-4 lg:overflow-x-auto pb-2">
            {selectedProject?.gallery.map((item) => (
              <figure
                key={item.id}
                className="w-full lg:min-w-[240px] lg:max-w-[240px] shrink-0 rounded-xl border border-white/10 bg-black/40 overflow-hidden"
              >
                <div className="h-32 relative">
                  {item.image ? (
                    <img src={item.image} alt={item.alt} className="h-full w-full object-cover" />
                  ) : (
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${item.bgClass ?? 'from-slate-900 via-slate-800 to-slate-700'}`}
                    />
                  )}
                </div>
                <figcaption className="p-3 text-xs text-white/70">{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Highlights</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {selectedProject?.highlights.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-white/40">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Responsibilities</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {selectedProject?.responsibilities.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-white/40">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Tech Stack</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedProject?.stack.map((item) => (
              <span key={item} className="text-xs bg-white/10 text-white/80 px-3 py-1 rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 text-xs text-white/60">
          <p>Role: {selectedProject?.role}</p>
          <p>Year: {selectedProject?.year}</p>
        </div>
      </div>
    </FadeSection>
  )
}
