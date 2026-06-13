import type { LocalizedText } from './i18n'

export interface BlobResult {
  url: string
  pathname: string
}

export type MediaKind = 'image' | 'video'

export interface CardItem {
  id: number
  image?: string
  imageId?: string | null
  imageKind?: MediaKind | null
  imageAlt?: string
  backgroundSvg?: string
  title: string
  subtitle: string
  description: string
  cta?: string
  href?: string
  bgClass?: string
}

export interface ProfileExperience {
  role: string
  company: string
  period: string
  details: string
}

export interface ProfileData {
  name: string
  role: string
  location: string
  summary: string
  availability: string
  highlights: string[]
  skills: string[]
  experience: ProfileExperience[]
}

export interface ContactItem {
  id: string
  label: string
  value: string
  hint: string
}

export interface ProjectCategory {
  id: string
  name: string
  description: string
}

export interface ProjectGalleryItem {
  id: string
  image?: string
  imageId?: string | null
  imageKind?: MediaKind | null
  alt: string
  caption: string
  bgClass?: string
}

export interface ProjectItem {
  id: string
  name: string
  summary: string
  description: string
  image?: string
  imageId?: string | null
  imageKind?: MediaKind | null
  bgClass?: string
  categoryId?: string | null
  gallery: ProjectGalleryItem[]
  stack: string[]
  highlights: string[]
  responsibilities: string[]
  year: string
  role: string
}

export interface SkillItem {
  id: string
  name: string
  description: string
  image?: string
  imageId?: string | null
  imageKind?: MediaKind | null
  bgClass?: string
}

// ---------------------------------------------------------------------------
// Raw (bilingual) shapes — what data files and the DB produce before a locale
// is chosen. Translatable fields are LocalizedText ({ en, id }); identifiers,
// URLs, tech names, and dates stay plain strings. See ./localize to collapse
// these to the string-based view types above for an active locale.
// ---------------------------------------------------------------------------

export interface RawCardItem {
  id: number
  image?: string
  imageId?: string | null
  imageKind?: MediaKind | null
  imageAlt?: LocalizedText
  backgroundSvg?: string
  title: LocalizedText
  subtitle: LocalizedText
  description: LocalizedText
  cta?: LocalizedText
  href?: string
  bgClass?: string
}

export interface RawProfileExperience {
  role: LocalizedText
  company: string
  period: string
  details: LocalizedText
}

export interface RawProfileData {
  name: string
  role: LocalizedText
  location: LocalizedText
  summary: LocalizedText
  availability: LocalizedText
  highlights: LocalizedText[]
  skills: string[]
  experience: RawProfileExperience[]
}

export interface RawContactItem {
  id: string
  label: LocalizedText
  value: string
  hint: LocalizedText
}

export interface RawProjectCategory {
  id: string
  name: LocalizedText
  description: LocalizedText
}

export interface RawProjectGalleryItem {
  id: string
  image?: string
  imageId?: string | null
  imageKind?: MediaKind | null
  alt: LocalizedText
  caption: LocalizedText
  bgClass?: string
}

export interface RawProjectItem {
  id: string
  name: string
  summary: LocalizedText
  description: LocalizedText
  image?: string
  imageId?: string | null
  imageKind?: MediaKind | null
  bgClass?: string
  categoryId?: string | null
  gallery: RawProjectGalleryItem[]
  stack: string[]
  highlights: LocalizedText[]
  responsibilities: LocalizedText[]
  year: string
  role: LocalizedText
}

export interface RawSkillItem {
  id: string
  name: LocalizedText
  description: LocalizedText
  image?: string
  imageId?: string | null
  imageKind?: MediaKind | null
  bgClass?: string
}