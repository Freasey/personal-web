'use client'
import { useEffect, useMemo, useState } from 'react'
import { useBlobs } from '../hooks/useBlobs'
import { getStaticDashboardData, type RawDashboardData } from '../data/dashboard.data'
import { localizeDashboardData } from '../localize'
import { getInitialLocale, persistLocale, type Locale } from '../i18n'
import { BioView, CardsView, ContactView, ProjectsView, SkillsView } from './views'
import { LanguageToggle } from './LanguageToggle'
import { DashboardLoading } from './DashboardLoading'

type DashboardView = 'cards' | 'bio' | 'projects' | 'skills' | 'contact'

export const Dashboard = () => {
  const [view, setView] = useState<DashboardView>('cards')
  const { blobUrl } = useBlobs()
  // No dummy data: content starts empty and is filled from the DB. `rawData`
  // is null until the first fetch resolves, while a loading state is shown.
  const [rawData, setRawData] = useState<RawDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [locale, setLocale] = useState<Locale>('en')

  // Resolve the stored/browser locale once mounted (avoids SSR/client mismatch).
  useEffect(() => {
    setLocale(getInitialLocale())
  }, [])

  const handleLocaleChange = (next: Locale) => {
    setLocale(next)
    persistLocale(next)
  }

  useEffect(() => {
    let isCancelled = false

    const syncData = async () => {
      try {
        const response = await fetch('/api/dashboard-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blobUrl }),
        })

        if (!response.ok) throw new Error('Failed to load dashboard data')

        const nextData = (await response.json()) as RawDashboardData

        if (!isCancelled) {
          setRawData(nextData)
        }
      } catch {
        // On failure, fall back to the UI base (navigation cards + empty
        // content) so the homepage still renders instead of staying blank.
        if (!isCancelled) {
          setRawData(getStaticDashboardData(blobUrl))
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    syncData()

    return () => {
      isCancelled = true
    }
  }, [blobUrl])

  // Collapse the raw bilingual data to the active locale. Toggling is instant
  // (no refetch) because both languages are already in memory.
  const dashboardData = useMemo(
    () => (rawData ? localizeDashboardData(rawData, locale) : null),
    [rawData, locale],
  )

  const projects = dashboardData?.projects
  useEffect(() => {
    if (!projects || projects.length === 0) {
      setSelectedProjectId(null)
      return
    }

    setSelectedProjectId((current) => {
      if (current && projects.some((project) => project.id === current)) {
        return current
      }

      return projects[0]?.id ?? null
    })
  }, [projects])

  const baseContainer =
    'backdrop-blur-2xl bg-black/20 w-full max-w-[1200px] rounded-2xl sm:rounded-3xl flex flex-col lg:flex-row p-3 sm:p-4 lg:p-6 gap-4 sm:gap-6 border border-white/10 shadow-2xl text-white'

  const containerClass =
    view === 'projects'
      ? `${baseContainer}`
      : view === 'contact'
      ? `${baseContainer} h-auto`
      : `${baseContainer} h-auto lg:h-[585px] overflow-y-auto lg:overflow-visible`

  // Show the loading state until the first fetch resolves.
  if (isLoading || !dashboardData) {
    return (
      <div className="w-full max-w-[1200px] flex flex-col gap-3">
        <div className="flex justify-end">
          <LanguageToggle locale={locale} onChange={handleLocaleChange} />
        </div>
        <DashboardLoading locale={locale} />
      </div>
    )
  }

  const { cards, profile, categories, skills, contacts } = dashboardData

  return (
    <div className="w-full max-w-[1200px] flex flex-col gap-3">
      <div className="flex justify-end">
        <LanguageToggle locale={locale} onChange={handleLocaleChange} />
      </div>
      <div className={containerClass}>
        {view === 'bio' ? (
          <BioView profile={profile} locale={locale} onBack={() => setView('cards')} />
        ) : view === 'projects' ? (
          <ProjectsView
            projects={dashboardData.projects}
            categories={categories}
            locale={locale}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            onBack={() => setView('cards')}
          />
        ) : view === 'skills' ? (
          <SkillsView skills={skills} locale={locale} onBack={() => setView('cards')} />
        ) : view === 'contact' ? (
          <ContactView contacts={contacts} locale={locale} onBack={() => setView('cards')} />
        ) : (
          <CardsView
            cards={cards}
            onBio={() => setView('bio')}
            onProjects={() => setView('projects')}
            onSkills={() => setView('skills')}
            onContact={() => setView('contact')}
          />
        )}
      </div>
    </div>
  )
}
