import type {
  CardItem,
  ContactItem,
  ProfileData,
  ProjectItem,
  SkillItem,
} from '../types'
import { getCards } from './cards.data'
import { getContactItems } from './contacts.data'
import { getProfileData } from './profile.data'
import { getProjectsData } from './projects.data'
import { getSkillsGallery } from './skills.data'

export interface DashboardData {
  cards: CardItem[]
  profile: ProfileData
  projects: ProjectItem[]
  skills: SkillItem[]
  contacts: ContactItem[]
}

export const createStaticDashboardData = (
  blobUrl: Record<string, string> | null,
): DashboardData => ({
  cards: getCards(blobUrl),
  profile: getProfileData(),
  projects: getProjectsData(blobUrl),
  skills: getSkillsGallery(blobUrl),
  contacts: getContactItems(),
})

export const getStaticDashboardData = createStaticDashboardData
