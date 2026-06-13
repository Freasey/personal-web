// Collapse raw bilingual dashboard data to plain string-based view types for a
// single active locale. Keeping this in one place means the rendering
// components (cards, views) stay locale-agnostic and consume plain strings.

import { pickLocale, type Locale } from './i18n'
import type { RawDashboardData } from './data/dashboard.data'
import type {
  CardItem,
  ContactItem,
  ProfileData,
  ProjectCategory,
  ProjectItem,
  SkillItem,
} from './types'

interface LocalizedDashboardData {
  cards: CardItem[]
  profile: ProfileData
  projects: ProjectItem[]
  categories: ProjectCategory[]
  skills: SkillItem[]
  contacts: ContactItem[]
}

const localizeCard = (card: RawDashboardData['cards'][number], locale: Locale): CardItem => ({
  id: card.id,
  image: card.image,
  imageId: card.imageId,
  imageKind: card.imageKind,
  imageAlt: card.imageAlt ? pickLocale(card.imageAlt, locale) : undefined,
  backgroundSvg: card.backgroundSvg,
  title: pickLocale(card.title, locale),
  subtitle: pickLocale(card.subtitle, locale),
  description: pickLocale(card.description, locale),
  cta: card.cta ? pickLocale(card.cta, locale) : undefined,
  href: card.href,
  bgClass: card.bgClass,
})

const localizeProfile = (
  profile: RawDashboardData['profile'],
  locale: Locale,
): ProfileData => ({
  name: profile.name,
  role: pickLocale(profile.role, locale),
  location: pickLocale(profile.location, locale),
  summary: pickLocale(profile.summary, locale),
  availability: pickLocale(profile.availability, locale),
  highlights: profile.highlights.map((item) => pickLocale(item, locale)).filter(Boolean),
  skills: profile.skills,
  experience: profile.experience.map((exp) => ({
    role: pickLocale(exp.role, locale),
    company: exp.company,
    period: exp.period,
    details: pickLocale(exp.details, locale),
  })),
})

const localizeContact = (
  contact: RawDashboardData['contacts'][number],
  locale: Locale,
): ContactItem => ({
  id: contact.id,
  label: pickLocale(contact.label, locale),
  value: contact.value,
  hint: pickLocale(contact.hint, locale),
})

const localizeProject = (
  project: RawDashboardData['projects'][number],
  locale: Locale,
): ProjectItem => ({
  id: project.id,
  name: project.name,
  summary: pickLocale(project.summary, locale),
  description: pickLocale(project.description, locale),
  image: project.image,
  imageId: project.imageId,
  imageKind: project.imageKind,
  bgClass: project.bgClass,
  categoryId: project.categoryId,
  gallery: project.gallery.map((item) => ({
    id: item.id,
    image: item.image,
    imageId: item.imageId,
    imageKind: item.imageKind,
    alt: pickLocale(item.alt, locale),
    caption: pickLocale(item.caption, locale),
    bgClass: item.bgClass,
  })),
  stack: project.stack,
  highlights: project.highlights.map((item) => pickLocale(item, locale)).filter(Boolean),
  responsibilities: project.responsibilities
    .map((item) => pickLocale(item, locale))
    .filter(Boolean),
  year: project.year,
  role: pickLocale(project.role, locale),
})

const localizeSkill = (
  skill: RawDashboardData['skills'][number],
  locale: Locale,
): SkillItem => ({
  id: skill.id,
  name: pickLocale(skill.name, locale),
  description: pickLocale(skill.description, locale),
  image: skill.image,
  imageId: skill.imageId,
  imageKind: skill.imageKind,
  bgClass: skill.bgClass,
})

const localizeCategory = (
  category: RawDashboardData['categories'][number],
  locale: Locale,
): ProjectCategory => ({
  id: category.id,
  name: pickLocale(category.name, locale),
  description: pickLocale(category.description, locale),
})

export const localizeDashboardData = (
  raw: RawDashboardData,
  locale: Locale,
): LocalizedDashboardData => ({
  cards: raw.cards.map((card) => localizeCard(card, locale)),
  profile: localizeProfile(raw.profile, locale),
  projects: raw.projects.map((project) => localizeProject(project, locale)),
  categories: raw.categories.map((category) => localizeCategory(category, locale)),
  skills: raw.skills.map((skill) => localizeSkill(skill, locale)),
  contacts: raw.contacts.map((contact) => localizeContact(contact, locale)),
})
