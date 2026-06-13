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
import { getContactItems } from './contacts.data'
import { getProfileData } from './profile.data'
import { getProjectsData } from './projects.data'
import { getSkillsGallery } from './skills.data'

/** Raw bilingual data straight from the data files / DB (translatable fields are { en, id }). */
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

export const createStaticDashboardData = (
  blobUrl: Record<string, string> | null,
): RawDashboardData => ({
  cards: getCards(blobUrl),
  profile: getProfileData(),
  projects: getProjectsData(blobUrl),
  // No static fallback: categories must come from the DB so their ids are real
  // UUIDs (a static id like "cat-web" can't satisfy projects.category_id).
  categories: [],
  skills: getSkillsGallery(blobUrl),
  contacts: getContactItems(),
})

export const getStaticDashboardData = createStaticDashboardData
