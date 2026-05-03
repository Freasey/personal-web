'use client'
import { useEffect, useState } from 'react'
import { useBlobs } from '../hooks/useBlobs'
import { getStaticDashboardData, loadDashboardData } from '../data/supabase.data'
import { BioView, CardsView, ContactView, ProjectsView, SkillsView } from './views'

type DashboardView = 'cards' | 'bio' | 'projects' | 'skills' | 'contact'

export const Dashboard = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
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

  const containerClass =
    view === 'projects'
      ? 'backdrop-blur-2xl bg-black/20 w-[95%] lg:w-[1200px] rounded-3xl flex flex-col lg:flex-row p-4 lg:p-6 gap-6 border border-white/10 shadow-2xl text-white'
      : view === 'contact'
      ? 'backdrop-blur-2xl bg-black/20 w-[95%] lg:w-[1200px] h-auto rounded-3xl flex flex-col lg:flex-row p-4 lg:p-6 gap-6 border border-white/10 shadow-2xl text-white'
      : 'backdrop-blur-2xl bg-black/20 w-[95%] lg:w-[1200px] h-auto lg:h-[585px] rounded-3xl flex flex-col lg:flex-row p-4 lg:p-6 gap-6 border border-white/10 shadow-2xl text-white overflow-y-auto lg:overflow-visible'

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
          hoveredCard={hoveredCard}
          onHover={setHoveredCard}
          onBio={() => setView('bio')}
          onProjects={() => setView('projects')}
          onSkills={() => setView('skills')}
          onContact={() => setView('contact')}
        />
      )}
    </div>
  )
}
