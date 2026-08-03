import type {
  CardItem,
  ContactItem,
  ProfileData,
  ProjectCategory,
  ProjectItem,
  RawCardItem,
  RawContactItem,
  RawProfileData,
  RawProjectCategory,
  RawProjectItem,
  RawSkillItem,
  SkillItem,
} from '../types'
import { getCards } from './cards.data'

/** Raw bilingual data straight from the DB (translatable fields are { en, id }). */
export interface RawDashboardData {
  cards: RawCardItem[]
  profile: RawProfileData
  projects: RawProjectItem[]
  categories: RawProjectCategory[]
  skills: RawSkillItem[]
  contacts: RawContactItem[]
}

/** String-based data for a single active locale, consumed by the views. */
export interface DashboardData {
  cards: CardItem[]
  profile: ProfileData
  projects: ProjectItem[]
  categories: ProjectCategory[]
  skills: SkillItem[]
  contacts: ContactItem[]
}

/**
 * An empty profile used as the base shape before DB content arrives. Content
 * (profile/projects/skills/contacts/categories) is no longer seeded with dummy
 * data; it must come from the database.
 */
const emptyProfile: RawProfileData = {
  name: '',
  role: { en: '' },
  location: { en: '' },
  summary: { en: '' },
  availability: { en: '' },
  highlights: [],
  skills: [],
  experience: [],
}

/**
 * Base dashboard data. Navigation cards live in the UI (see ./cards.data); every
 * other section starts empty and is filled from the database. There is no dummy
 * content fallback anymore.
 */
export const createStaticDashboardData = (
  blobUrl: Record<string, string> | null,
): RawDashboardData => ({
  cards: getCards(blobUrl),
  profile: emptyProfile,
  projects: [],
  categories: [],
  skills: [],
  contacts: [],
})

export const getStaticDashboardData = createStaticDashboardData
