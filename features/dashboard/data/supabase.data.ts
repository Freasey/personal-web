import 'server-only'

import type {
  CardItem,
  ContactItem,
  ProfileData,
  ProjectItem,
  SkillItem,
} from '../types'
import {
  createStaticDashboardData,
  type DashboardData,
} from './dashboard.data'

type SupabaseRow = Record<string, unknown>

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

const readString = (row: SupabaseRow, ...keys: string[]) => {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }

  return undefined
}

const readNumber = (row: SupabaseRow, ...keys: string[]) => {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
  }

  return undefined
}

const readBoolean = (row: SupabaseRow, ...keys: string[]) => {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'boolean') {
      return value
    }
  }

  return undefined
}

const readImage = (row: SupabaseRow) =>
  readString(row, 'image_url', 'image', 'url', 'pathname', 'media_url')

const readTheme = (row: SupabaseRow) =>
  readString(row, 'theme_key', 'bg_class', 'color_token', 'style_key')

const isActiveRow = (row: SupabaseRow) => readBoolean(row, 'is_active') !== false

const sortRows = <T extends SupabaseRow>(rows: T[]) =>
  [...rows].sort((left, right) => {
    const leftOrder = readNumber(left, 'sort_order') ?? 0
    const rightOrder = readNumber(right, 'sort_order') ?? 0
    return leftOrder - rightOrder
  })

const fetchTable = async <T extends SupabaseRow>(table: string, query = ''): Promise<T[]> => {
  if (!hasSupabaseConfig || !supabaseUrl || !supabaseAnonKey) {
    return []
  }

  const endpoint = new URL(`/rest/v1/${table}`, supabaseUrl)
  endpoint.searchParams.set('select', '*')

  if (query) {
    const queryParams = new URLSearchParams(query)
    for (const [key, value] of queryParams.entries()) {
      endpoint.searchParams.set(key, value)
    }
  }

  const response = await fetch(endpoint.toString(), {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      Accept: 'application/json'
    },
    cache: 'no-store'
  })

  if (!response.ok) {
    return []
  }

  const data = (await response.json()) as T[]
  return Array.isArray(data) ? data : []
}

const mapCard = (row: SupabaseRow, fallback?: CardItem): CardItem => ({
  id: Number(readNumber(row, 'id') ?? fallback?.id ?? 0),
  image: readImage(row) ?? fallback?.image,
  imageAlt: readString(row, 'image_alt', 'alt') ?? fallback?.imageAlt,
  backgroundSvg: readString(row, 'background_svg', 'backgroundSvg') ?? fallback?.backgroundSvg,
  title: readString(row, 'title', 'name') ?? fallback?.title ?? '',
  subtitle: readString(row, 'subtitle') ?? fallback?.subtitle ?? '',
  description: readString(row, 'description', 'summary') ?? fallback?.description ?? '',
  cta: readString(row, 'cta', 'call_to_action') ?? fallback?.cta,
  href: readString(row, 'href', 'link') ?? fallback?.href,
  bgClass: fallback?.bgClass
})

const mapSkill = (row: SupabaseRow, fallback?: SkillItem): SkillItem => ({
  id: readString(row, 'id') ?? fallback?.id ?? '',
  name: readString(row, 'name', 'title') ?? fallback?.name ?? '',
  description: readString(row, 'description', 'summary') ?? fallback?.description ?? '',
  image: readImage(row) ?? fallback?.image,
  bgClass: readTheme(row) ?? fallback?.bgClass
})

const mapContact = (row: SupabaseRow, fallback?: ContactItem): ContactItem => ({
  id: readString(row, 'id') ?? fallback?.id ?? '',
  label: readString(row, 'label', 'name', 'type') ?? fallback?.label ?? '',
  value: readString(row, 'value', 'content') ?? fallback?.value ?? '',
  hint: readString(row, 'hint', 'description') ?? fallback?.hint ?? ''
})

const mapProjectGalleryItem = (row: SupabaseRow, fallback?: ProjectItem['gallery'][number]) => ({
  id: readString(row, 'id') ?? fallback?.id ?? '',
  image: readImage(row) ?? fallback?.image,
  alt: readString(row, 'alt', 'image_alt') ?? fallback?.alt ?? '',
  caption: readString(row, 'caption', 'description') ?? fallback?.caption ?? '',
  bgClass: readTheme(row) ?? fallback?.bgClass
})

const mapProfile = (row: SupabaseRow, fallback: ProfileData): ProfileData => ({
  name: readString(row, 'name') ?? fallback.name,
  role: readString(row, 'role', 'title') ?? fallback.role,
  location: readString(row, 'location') ?? fallback.location,
  summary: readString(row, 'summary', 'bio') ?? fallback.summary,
  availability: readString(row, 'availability') ?? fallback.availability,
  highlights: fallback.highlights,
  skills: fallback.skills,
  experience: fallback.experience
})

const mapProject = (row: SupabaseRow, fallback?: ProjectItem): ProjectItem => ({
  id: readString(row, 'id') ?? fallback?.id ?? '',
  name: readString(row, 'name', 'title') ?? fallback?.name ?? '',
  summary: readString(row, 'summary') ?? fallback?.summary ?? '',
  description: readString(row, 'description') ?? fallback?.description ?? '',
  image: readImage(row) ?? fallback?.image,
  bgClass: readTheme(row) ?? fallback?.bgClass,
  gallery: fallback?.gallery ?? [],
  stack: fallback?.stack ?? [],
  highlights: fallback?.highlights ?? [],
  responsibilities: fallback?.responsibilities ?? [],
  year: readString(row, 'year') ?? fallback?.year ?? '',
  role: readString(row, 'role', 'position') ?? fallback?.role ?? ''
})

export const loadDashboardData = async (blobUrl: Record<string, string> | null): Promise<DashboardData> => {
  const staticData = createStaticDashboardData(blobUrl)

  if (!hasSupabaseConfig) {
    return staticData
  }

  try {
    const [profiles, cards, contacts, projects, skills] = await Promise.all([
      fetchTable<SupabaseRow>('profiles'),
      fetchTable<SupabaseRow>('dashboard_cards'),
      fetchTable<SupabaseRow>('contacts'),
      fetchTable<SupabaseRow>('projects'),
      fetchTable<SupabaseRow>('skill_items')
    ])

    const activeProfileRows = sortRows(profiles.filter(isActiveRow))
    const remoteProfile = activeProfileRows[0]
    const remoteCards = sortRows(cards.filter(isActiveRow))
    const remoteContacts = sortRows(contacts.filter(isActiveRow))
    const remoteProjects = sortRows(projects.filter(isActiveRow))
    const remoteSkills = sortRows(skills.filter(isActiveRow))

    const profileId = remoteProfile ? readString(remoteProfile, 'id') : undefined

    const [profileHighlights, profileSkills, profileExperiences] = profileId
      ? await Promise.all([
          fetchTable<SupabaseRow>('profile_highlights', `profile_id=eq.${profileId}`),
          fetchTable<SupabaseRow>('profile_skills', `profile_id=eq.${profileId}`),
          fetchTable<SupabaseRow>('profile_experiences', `profile_id=eq.${profileId}`)
        ])
      : [[], [], []]

    const cardsData = remoteCards.length > 0
      ? remoteCards.map((card, index) => mapCard(card, staticData.cards[index]))
      : staticData.cards

    const profileData = remoteProfile
      ? (() => {
          const fallback = staticData.profile
          const baseProfile = mapProfile(remoteProfile, fallback)

          const highlights = sortRows(profileHighlights)
            .map((row, index) => readString(row, 'highlight', 'content', 'text') ?? fallback.highlights[index] ?? '')
            .filter(Boolean)

          const skillsList = sortRows(profileSkills)
            .map((row, index) => readString(row, 'skill', 'name', 'value') ?? fallback.skills[index] ?? '')
            .filter(Boolean)
          const experienceList = sortRows(profileExperiences).map((row, index) => ({
            role: readString(row, 'role', 'title') ?? fallback.experience[index]?.role ?? '',
            company: readString(row, 'company') ?? fallback.experience[index]?.company ?? '',
            period: readString(row, 'period', 'duration') ?? fallback.experience[index]?.period ?? '',
            details: readString(row, 'details', 'description') ?? fallback.experience[index]?.details ?? ''
          }))

          return {
            ...baseProfile,
            highlights: highlights.length > 0 ? highlights : fallback.highlights,
            skills: skillsList.length > 0 ? skillsList : fallback.skills,
            experience: experienceList.length > 0 ? experienceList : fallback.experience
          }
        })()
      : staticData.profile

    const projectsData = remoteProjects.length > 0
      ? await Promise.all(
          remoteProjects.map(async (project, index) => {
            const fallback = staticData.projects[index]
            const projectId = readString(project, 'id')

            const [galleryRows, stackRows, highlightRows, responsibilityRows] = projectId
              ? await Promise.all([
                  fetchTable<SupabaseRow>('project_gallery', `project_id=eq.${projectId}`),
                  fetchTable<SupabaseRow>('project_stacks', `project_id=eq.${projectId}`),
                  fetchTable<SupabaseRow>('project_highlights', `project_id=eq.${projectId}`),
                  fetchTable<SupabaseRow>('project_responsibilities', `project_id=eq.${projectId}`)
                ])
              : [[], [], [], []]

            const gallery = sortRows(galleryRows).map((row, galleryIndex) => mapProjectGalleryItem(row, fallback?.gallery[galleryIndex]))
            const stack = sortRows(stackRows)
              .map((row) => readString(row, 'stack', 'name', 'value') ?? '')
              .filter(Boolean)
            const highlights = sortRows(highlightRows)
              .map((row) => readString(row, 'highlight', 'content', 'text') ?? '')
              .filter(Boolean)
            const responsibilities = sortRows(responsibilityRows)
              .map((row) => readString(row, 'responsibility', 'content', 'text', 'description') ?? '')
              .filter(Boolean)

            return {
              ...mapProject(project, fallback),
              gallery: gallery.length > 0 ? gallery : fallback?.gallery ?? [],
              stack: stack.length > 0 ? stack : fallback?.stack ?? [],
              highlights: highlights.length > 0 ? highlights : fallback?.highlights ?? [],
              responsibilities: responsibilities.length > 0 ? responsibilities : fallback?.responsibilities ?? []
            }
          })
        )
      : staticData.projects

    const skillsData = remoteSkills.length > 0
      ? remoteSkills.map((skill, index) => mapSkill(skill, staticData.skills[index]))
      : staticData.skills

    const contactsData = remoteContacts.length > 0
      ? remoteContacts.map((contact, index) => mapContact(contact, staticData.contacts[index]))
      : staticData.contacts

    return {
      cards: cardsData,
      profile: profileData,
      projects: projectsData,
      skills: skillsData,
      contacts: contactsData
    }
  } catch {
    return staticData
  }
}
