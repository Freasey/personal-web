import 'server-only'

import type {
  MediaKind,
  RawCardItem,
  RawContactItem,
  RawProfileData,
  RawProjectCategory,
  RawProjectItem,
  RawSkillItem,
} from '../types'
import type { LocalizedText } from '../i18n'
import { hasLocalizedContent } from '../i18n'
import {
  createStaticDashboardData,
  type RawDashboardData,
} from './dashboard.data'
import { hasDb, tryGetSql } from '@/lib/db'

type Row = Record<string, unknown>

const readString = (row: Row, ...keys: string[]) => {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }

  return undefined
}

/**
 * Read a translatable field as bilingual text. Columns are jsonb ({ en, id }),
 * but legacy/plain-string values (and JSON strings) are tolerated and wrapped
 * as { en }. Returns undefined when no key holds content.
 */
const fromObject = (value: object): LocalizedText | undefined => {
  const obj = value as Record<string, unknown>
  const en = typeof obj.en === 'string' && obj.en.trim() ? obj.en : undefined
  const id = typeof obj.id === 'string' && obj.id.trim() ? obj.id : undefined
  return en || id ? { en, id } : undefined
}

const readLocalized = (row: Row, ...keys: string[]): LocalizedText | undefined => {
  for (const key of keys) {
    const value = row[key]
    if (value == null) continue

    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) continue
      if (trimmed.startsWith('{')) {
        try {
          const parsed: unknown = JSON.parse(trimmed)
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            const result = fromObject(parsed)
            if (result) return result
          }
        } catch {
          // not JSON after all — fall through to plain string
        }
      }
      return { en: trimmed }
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      const result = fromObject(value)
      if (result) return result
    }
  }

  return undefined
}

const readNumber = (row: Row, ...keys: string[]) => {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
  }

  return undefined
}

const readBoolean = (row: Row, ...keys: string[]) => {
  for (const key of keys) {
    const value = row[key]
    if (typeof value === 'boolean') {
      return value
    }
  }

  return undefined
}

interface AssetEmbed {
  public_url?: string | null
  kind?: string | null
}

const readEmbeddedAsset = (row: Row, key: string): AssetEmbed | null => {
  const value = row[key]
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as AssetEmbed
}

const readImage = (row: Row, embedKey = 'image') => {
  const asset = readEmbeddedAsset(row, embedKey)
  if (asset?.public_url) return asset.public_url
  return readString(row, 'image_url', 'image', 'url', 'pathname', 'media_url')
}

const readImageKind = (row: Row, embedKey = 'image'): MediaKind | null => {
  const asset = readEmbeddedAsset(row, embedKey)
  if (asset?.kind === 'image' || asset?.kind === 'video') return asset.kind
  return null
}

const readImageId = (row: Row, key = 'image_id') => {
  const value = row[key]
  return typeof value === 'string' && value.trim() ? value : null
}

const readTheme = (row: Row) =>
  readString(row, 'theme_key', 'bg_class', 'color_token', 'style_key')

const isActiveRow = (row: Row) => readBoolean(row, 'is_active') !== false

const sortRows = <T extends Row>(rows: T[]) =>
  [...rows].sort((left, right) => {
    const leftOrder = readNumber(left, 'sort_order') ?? 0
    const rightOrder = readNumber(right, 'sort_order') ?? 0
    return leftOrder - rightOrder
  })

const emptyText: LocalizedText = { en: '' }

const mapCard = (row: Row, fallback?: RawCardItem): RawCardItem => ({
  id: Number(readNumber(row, 'id') ?? fallback?.id ?? 0),
  image: readImage(row) ?? fallback?.image,
  imageId: readImageId(row),
  imageKind: readImageKind(row),
  imageAlt: readLocalized(row, 'image_alt', 'alt') ?? fallback?.imageAlt,
  backgroundSvg: readString(row, 'background_svg', 'backgroundSvg') ?? fallback?.backgroundSvg,
  title: readLocalized(row, 'title', 'name') ?? fallback?.title ?? emptyText,
  subtitle: readLocalized(row, 'subtitle') ?? fallback?.subtitle ?? emptyText,
  description: readLocalized(row, 'description', 'summary') ?? fallback?.description ?? emptyText,
  cta: readLocalized(row, 'cta', 'cta_label', 'call_to_action') ?? fallback?.cta,
  href: readString(row, 'href', 'link') ?? fallback?.href,
  bgClass: fallback?.bgClass,
})

const mapSkill = (row: Row, fallback?: RawSkillItem): RawSkillItem => ({
  id: readString(row, 'id') ?? fallback?.id ?? '',
  name: readLocalized(row, 'name', 'title') ?? fallback?.name ?? emptyText,
  description: readLocalized(row, 'description', 'summary') ?? fallback?.description ?? emptyText,
  image: readImage(row) ?? fallback?.image,
  imageId: readImageId(row),
  imageKind: readImageKind(row),
  bgClass: readTheme(row) ?? fallback?.bgClass,
})

const mapContact = (row: Row, fallback?: RawContactItem): RawContactItem => ({
  id: readString(row, 'id') ?? fallback?.id ?? '',
  label: readLocalized(row, 'label', 'name', 'type') ?? fallback?.label ?? emptyText,
  value: readString(row, 'value', 'content') ?? fallback?.value ?? '',
  hint: readLocalized(row, 'hint', 'description') ?? fallback?.hint ?? emptyText,
})

const mapCategory = (row: Row, fallback?: RawProjectCategory): RawProjectCategory => ({
  id: readString(row, 'id') ?? fallback?.id ?? '',
  name: readLocalized(row, 'name', 'title') ?? fallback?.name ?? emptyText,
  description: readLocalized(row, 'description', 'summary') ?? fallback?.description ?? emptyText,
})

const mapProjectGalleryItem = (
  row: Row,
  fallback?: RawProjectItem['gallery'][number],
): RawProjectItem['gallery'][number] => ({
  id: readString(row, 'id') ?? fallback?.id ?? '',
  image: readImage(row, 'asset') ?? fallback?.image,
  imageId: readImageId(row, 'asset_id'),
  imageKind: readImageKind(row, 'asset'),
  alt: readLocalized(row, 'alt', 'image_alt') ?? fallback?.alt ?? emptyText,
  caption: readLocalized(row, 'caption', 'description') ?? fallback?.caption ?? emptyText,
  bgClass: readTheme(row) ?? fallback?.bgClass,
})

const mapProfile = (row: Row, fallback: RawProfileData): RawProfileData => ({
  name: readString(row, 'name') ?? fallback.name,
  role: readLocalized(row, 'role', 'title') ?? fallback.role,
  location: readLocalized(row, 'location') ?? fallback.location,
  summary: readLocalized(row, 'summary', 'bio') ?? fallback.summary,
  availability: readLocalized(row, 'availability') ?? fallback.availability,
  highlights: fallback.highlights,
  skills: fallback.skills,
  experience: fallback.experience,
})

const mapProject = (row: Row, fallback?: RawProjectItem): RawProjectItem => ({
  id: readString(row, 'id') ?? fallback?.id ?? '',
  name: readString(row, 'name', 'title') ?? fallback?.name ?? '',
  summary: readLocalized(row, 'summary') ?? fallback?.summary ?? emptyText,
  description: readLocalized(row, 'description') ?? fallback?.description ?? emptyText,
  image: readImage(row) ?? fallback?.image,
  imageId: readImageId(row),
  imageKind: readImageKind(row),
  bgClass: readTheme(row) ?? fallback?.bgClass,
  gallery: fallback?.gallery ?? [],
  stack: fallback?.stack ?? [],
  highlights: fallback?.highlights ?? [],
  responsibilities: fallback?.responsibilities ?? [],
  year: readString(row, 'year') ?? readNumber(row, 'year')?.toString() ?? fallback?.year ?? '',
  role: readLocalized(row, 'role', 'position') ?? fallback?.role ?? emptyText,
  categoryId: readString(row, 'category_id') ?? fallback?.categoryId ?? null,
})

// Note: the `json_build_object(...)` expressions below are static SQL (no user
// input) that mirror PostgREST's embedded asset object (`{public_url, kind}`),
// so they live inline in the template literal — only real values use `${}`.

export const loadDashboardData = async (
  blobUrl: Record<string, string> | null,
): Promise<RawDashboardData> => {
  const staticData = createStaticDashboardData(blobUrl)

  if (!hasDb) {
    return staticData
  }

  const sql = tryGetSql()
  if (!sql) {
    return staticData
  }

  try {
    const [profiles, cards, contacts, projects, categories, skills] = await Promise.all([
      sql`select * from profiles` as Promise<Row[]>,
      sql`select c.*, case when a.id is not null then json_build_object('public_url', a.public_url, 'kind', a.kind) end as image
            from dashboard_cards c left join assets a on a.id = c.image_id` as Promise<Row[]>,
      sql`select * from contacts` as Promise<Row[]>,
      sql`select p.*, case when a.id is not null then json_build_object('public_url', a.public_url, 'kind', a.kind) end as image
            from projects p left join assets a on a.id = p.image_id` as Promise<Row[]>,
      sql`select * from project_categories` as Promise<Row[]>,
      sql`select s.*, case when a.id is not null then json_build_object('public_url', a.public_url, 'kind', a.kind) end as image
            from skill_items s left join assets a on a.id = s.image_id` as Promise<Row[]>,
    ])

    const activeProfileRows = sortRows(profiles.filter(isActiveRow))
    const remoteProfile = activeProfileRows[0]
    const remoteCards = sortRows(cards.filter(isActiveRow))
    const remoteContacts = sortRows(contacts.filter(isActiveRow))
    const remoteProjects = sortRows(projects.filter(isActiveRow))
    const remoteCategories = sortRows(categories.filter(isActiveRow))
    const remoteSkills = sortRows(skills.filter(isActiveRow))

    const profileId = remoteProfile ? readString(remoteProfile, 'id') : undefined

    const [profileHighlights, profileSkills, profileExperiences] = profileId
      ? await Promise.all([
          sql`select * from profile_highlights where profile_id = ${profileId}` as Promise<Row[]>,
          sql`select * from profile_skills where profile_id = ${profileId}` as Promise<Row[]>,
          sql`select * from profile_experiences where profile_id = ${profileId}` as Promise<Row[]>,
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
            .map((row, index) => readLocalized(row, 'highlight', 'content', 'text') ?? fallback.highlights[index])
            .filter((item): item is LocalizedText => hasLocalizedContent(item))

          const skillsList = sortRows(profileSkills)
            .map((row, index) => readString(row, 'skill', 'name', 'value') ?? fallback.skills[index] ?? '')
            .filter(Boolean)
          const experienceList = sortRows(profileExperiences).map((row, index) => ({
            role: readLocalized(row, 'role', 'title') ?? fallback.experience[index]?.role ?? emptyText,
            company: readString(row, 'company') ?? fallback.experience[index]?.company ?? '',
            period: readString(row, 'period', 'duration') ?? fallback.experience[index]?.period ?? '',
            details: readLocalized(row, 'details', 'description') ?? fallback.experience[index]?.details ?? emptyText,
          }))

          return {
            ...baseProfile,
            highlights: highlights.length > 0 ? highlights : fallback.highlights,
            skills: skillsList.length > 0 ? skillsList : fallback.skills,
            experience: experienceList.length > 0 ? experienceList : fallback.experience,
          }
        })()
      : staticData.profile

    const projectsData = remoteProjects.length > 0
      ? await Promise.all(
          remoteProjects.map(async (project, index) => {
            const fallback = staticData.projects[index]
            const pid = readString(project, 'id')

            const [galleryRows, stackRows, highlightRows, responsibilityRows] = pid
              ? await Promise.all([
                  sql`select g.*, case when a.id is not null then json_build_object('public_url', a.public_url, 'kind', a.kind) end as asset
                        from project_gallery g left join assets a on a.id = g.asset_id
                        where g.project_id = ${pid}` as Promise<Row[]>,
                  sql`select * from project_stacks where project_id = ${pid}` as Promise<Row[]>,
                  sql`select * from project_highlights where project_id = ${pid}` as Promise<Row[]>,
                  sql`select * from project_responsibilities where project_id = ${pid}` as Promise<Row[]>,
                ])
              : [[], [], [], []]

            const gallery = sortRows(galleryRows).map((row, galleryIndex) => mapProjectGalleryItem(row, fallback?.gallery[galleryIndex]))
            const stack = sortRows(stackRows)
              .map((row) => readString(row, 'stack_name', 'stack', 'name', 'value') ?? '')
              .filter(Boolean)
            const highlights = sortRows(highlightRows)
              .map((row) => readLocalized(row, 'highlight', 'content', 'text'))
              .filter((item): item is LocalizedText => hasLocalizedContent(item))
            const responsibilities = sortRows(responsibilityRows)
              .map((row) => readLocalized(row, 'responsibility', 'content', 'text', 'description'))
              .filter((item): item is LocalizedText => hasLocalizedContent(item))

            return {
              ...mapProject(project, fallback),
              gallery: gallery.length > 0 ? gallery : fallback?.gallery ?? [],
              stack: stack.length > 0 ? stack : fallback?.stack ?? [],
              highlights: highlights.length > 0 ? highlights : fallback?.highlights ?? [],
              responsibilities: responsibilities.length > 0 ? responsibilities : fallback?.responsibilities ?? [],
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

    const categoriesData = remoteCategories.length > 0
      ? remoteCategories.map((category, index) => mapCategory(category, staticData.categories[index]))
      : staticData.categories

    return {
      cards: cardsData,
      profile: profileData,
      projects: projectsData,
      categories: categoriesData,
      skills: skillsData,
      contacts: contactsData,
    }
  } catch {
    return staticData
  }
}
