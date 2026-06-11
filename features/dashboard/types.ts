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