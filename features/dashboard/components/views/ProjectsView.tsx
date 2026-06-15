import { useMemo, useState } from 'react'
import type { ProjectCategory, ProjectItem } from '../../types'
import { UI, type Locale } from '../../i18n'
import { FadeSection } from '../ui/FadeSection'
import { Media } from '../ui/Media'

interface ProjectsViewProps {
  projects: ProjectItem[]
  categories: ProjectCategory[]
  locale: Locale
  selectedProjectId: string | null
  onSelectProject: (id: string) => void
  onBack: () => void
}

const UNCATEGORIZED = '__other__'

export const ProjectsView = ({
  projects,
  categories,
  locale,
  selectedProjectId,
  onSelectProject,
  onBack,
}: ProjectsViewProps) => {
  const t = UI[locale]
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [showDetailMobile, setShowDetailMobile] = useState(false)

  const isUncategorized = (project: ProjectItem) =>
    !project.categoryId || !categories.some((category) => category.id === project.categoryId)

  const countFor = (categoryId: string) =>
    projects.filter((project) => project.categoryId === categoryId).length
  const otherCount = projects.filter(isUncategorized).length

  // Only show categories that actually have projects, plus an "Other" bucket.
  const visibleCategories = useMemo(
    () => categories.filter((category) => countFor(category.id) > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, projects],
  )

  const trimmed = query.trim().toLowerCase()
  const searching = trimmed.length > 0
  const searchMatches = useMemo(
    () =>
      searching
        ? projects.filter(
            (project) =>
              project.name.toLowerCase().includes(trimmed) ||
              project.summary.toLowerCase().includes(trimmed),
          )
        : [],
    [projects, searching, trimmed],
  )

  const categoryProjects = useMemo(() => {
    if (selectedCategoryId === null) return []
    if (selectedCategoryId === UNCATEGORIZED) return projects.filter(isUncategorized)
    return projects.filter((project) => project.categoryId === selectedCategoryId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, selectedCategoryId, categories])

  const openCategory = (id: string) => {
    setSelectedCategoryId(id)
    setShowDetailMobile(false)
  }

  const backToTypes = () => {
    setSelectedCategoryId(null)
    setQuery('')
    setShowDetailMobile(false)
  }

  const activeCategoryName =
    selectedCategoryId === UNCATEGORIZED
      ? t.otherType
      : categories.find((category) => category.id === selectedCategoryId)?.name ?? ''

  // Header: title + a "back to menu" control, mirroring the other views.
  const header = (
    <div className="flex items-start sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs sm:text-sm uppercase tracking-[0.25em] sm:tracking-[0.3em] text-white/60">
          {t.projects}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold mt-1 sm:mt-2">
          {searching
            ? t.searchResults
            : selectedCategoryId !== null
              ? activeCategoryName
              : t.selectedWork}
        </h2>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="shrink-0 text-xs text-white/70 hover:text-white border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 transition cursor-pointer"
      >
        {t.backToMenu}
      </button>
    </div>
  )

  // ── Project list + detail (shared by search results and a single category) ──
  const renderProjectsAndDetail = (list: ProjectItem[]) => {
    const selectedProject =
      list.find((project) => project.id === selectedProjectId) ?? list[0]

    if (list.length === 0) {
      return (
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-10 text-center text-sm text-white/60">
          {t.noResults}
        </div>
      )
    }

    return (
      <>
        <div
          className={`flex flex-col lg:flex-row gap-4 lg:overflow-x-auto pb-2 ${
            showDetailMobile ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {list.map((project) => (
            <article
              key={project.id}
              className={`w-full lg:min-w-[260px] lg:max-w-[260px] shrink-0 rounded-2xl border ${
                project.id === selectedProject?.id ? 'border-white/40' : 'border-white/10'
              } bg-black/30 overflow-hidden flex flex-col`}
            >
              <div className="h-36 sm:h-40 relative">
                <Media
                  src={project.image}
                  kind={project.imageKind}
                  alt={project.name}
                  className="h-full w-full object-cover"
                  fallbackClass={project.bgClass}
                />
              </div>
              <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
                <p className="text-sm font-semibold">{project.name}</p>
                <p className="text-xs text-white/70 leading-relaxed">{project.summary}</p>
                <button
                  type="button"
                  onClick={() => {
                    onSelectProject(project.id)
                    setShowDetailMobile(true)
                  }}
                  className="mt-auto text-xs text-white/80 hover:text-white border border-white/20 rounded-full px-3 py-2 transition cursor-pointer"
                >
                  {t.detailProject}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div
          className={`rounded-2xl border border-white/10 bg-black/30 px-4 sm:px-6 py-4 sm:py-5 ${
            showDetailMobile ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex justify-between items-center gap-3">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/60">
              {t.projectDetail}
            </p>
            <button
              type="button"
              onClick={() => setShowDetailMobile(false)}
              className="lg:hidden shrink-0 text-xs text-white/70 hover:text-white border border-white/20 rounded-full px-3 py-1.5 transition cursor-pointer"
            >
              {t.backToList}
            </button>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mt-2 sm:mt-3 wrap-break-word">
            {selectedProject?.name}
          </h3>
          <p className="text-sm text-white/70 mt-2 leading-relaxed">{selectedProject?.description}</p>

          <div className="mt-4 sm:mt-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">{t.gallery}</p>
            <div className="mt-3 flex flex-col lg:flex-row gap-3 sm:gap-4 lg:overflow-x-auto pb-2">
              {selectedProject?.gallery.map((item) => (
                <figure
                  key={item.id}
                  className="w-full lg:min-w-[240px] lg:max-w-[240px] shrink-0 rounded-xl border border-white/10 bg-black/40 overflow-hidden"
                >
                  <div className="h-36 sm:h-32 relative">
                    <Media
                      src={item.image}
                      kind={item.imageKind}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                      fallbackClass={item.bgClass}
                    />
                  </div>
                  <figcaption className="p-3 text-xs text-white/70">{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mt-4 sm:mt-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">{t.highlights}</p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {selectedProject?.highlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 sm:mt-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">{t.responsibilities}</p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              {selectedProject?.responsibilities.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-white/40">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 sm:mt-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">{t.techStack}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedProject?.stack.map((item) => (
                <span
                  key={item}
                  className="text-[11px] sm:text-xs bg-white/10 text-white/80 px-2.5 sm:px-3 py-1 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 sm:mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
            <p>{t.role}: {selectedProject?.role}</p>
            <p>{t.year}: {selectedProject?.year}</p>
          </div>
        </div>
      </>
    )
  }

  // ── Category grid (entry level) ──
  const renderCategoryGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {visibleCategories.length === 0 && otherCount === 0 && (
        <p className="text-sm text-white/60">{t.noResults}</p>
      )}
      {visibleCategories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => openCategory(category.id)}
          className="group text-left rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5 transition hover:border-white/40 hover:bg-black/40 cursor-pointer"
        >
          <p className="text-base sm:text-lg font-semibold">{category.name}</p>
          {category.description && (
            <p className="mt-1 text-xs text-white/60 leading-relaxed">{category.description}</p>
          )}
          <p className="mt-3 text-xs text-white/40">
            {countFor(category.id)} {t.projectsUnit}
            <span className="ml-2 inline-block transition group-hover:translate-x-0.5">→</span>
          </p>
        </button>
      ))}
      {otherCount > 0 && (
        <button
          type="button"
          onClick={() => openCategory(UNCATEGORIZED)}
          className="group text-left rounded-2xl border border-dashed border-white/15 bg-black/20 p-4 sm:p-5 transition hover:border-white/40 hover:bg-black/40 cursor-pointer"
        >
          <p className="text-base sm:text-lg font-semibold">{t.otherType}</p>
          <p className="mt-3 text-xs text-white/40">
            {otherCount} {t.projectsUnit}
            <span className="ml-2 inline-block transition group-hover:translate-x-0.5">→</span>
          </p>
        </button>
      )}
    </div>
  )

  return (
    <FadeSection className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
      {header}

      {/* Search box + "back to types" live at the type level (and while searching). */}
      {selectedCategoryId === null ? (
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setShowDetailMobile(false)
          }}
          placeholder={t.searchPlaceholder}
          className="w-full rounded-full border border-white/15 bg-black/30 px-4 sm:px-5 py-2.5 text-sm text-white placeholder:text-white/40 transition focus:border-white/40 focus:outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={backToTypes}
          className="self-start text-xs text-white/70 hover:text-white border border-white/20 rounded-full px-3 py-1.5 transition cursor-pointer"
        >
          {t.backToTypes}
        </button>
      )}

      {searching
        ? renderProjectsAndDetail(searchMatches)
        : selectedCategoryId !== null
          ? renderProjectsAndDetail(categoryProjects)
          : renderCategoryGrid()}
    </FadeSection>
  )
}
