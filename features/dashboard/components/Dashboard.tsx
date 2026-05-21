'use client'
import { useEffect, useState } from 'react'
import { useBlobs } from '../hooks/useBlobs'
import { getStaticDashboardData, loadDashboardData } from '../data/supabase.data'
import { BioView, CardsView, ContactView, ProjectsView, SkillsView } from './views'

type DashboardView = 'cards' | 'bio' | 'projects' | 'skills' | 'contact'

export const Dashboard = () => {
  const [view, setView] = useState<DashboardView>('cards')
  const { blobUrl } = useBlobs()
  const [dashboardData, setDashboardData] = useState(() => getStaticDashboardData(blobUrl))
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  useEffect(() => {
    setDashboardData(getStaticDashboardData(blobUrl))
  }, [blobUrl])

  useEffect(() => {
    let isCancelled = false

    const syncData = async () => {
      const nextData = await loadDashboardData(blobUrl)

      if (!isCancelled) {
        setDashboardData(nextData)
      }
    }

    syncData()

    return () => {
      isCancelled = true
    }
  }, [blobUrl])

  const { cards, profile, projects, skills, contacts } = dashboardData
  useEffect(() => {
    if (projects.length === 0) {
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

  return (
    <div className={containerClass}>
      {view === 'bio' ? (
        <BioView profile={profile} onBack={() => setView('cards')} />
      ) : view === 'projects' ? (
        <ProjectsView
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          onBack={() => setView('cards')}
        />
      ) : view === 'skills' ? (
        <SkillsView skills={skills} onBack={() => setView('cards')} />
      ) : view === 'contact' ? (
        <ContactView contacts={contacts} onBack={() => setView('cards')} />
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
  )
}
