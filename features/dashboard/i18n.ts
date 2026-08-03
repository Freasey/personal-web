// Bilingual (Indonesian / English) support for the dashboard.
//
// Design: data is stored/produced in a raw bilingual shape (`LocalizedText`,
// i.e. { en, id }). It is collapsed to plain strings for a single active locale
// at the rendering boundary via `pickLocale` / the localizers in ./localize.
// UI chrome (section titles, buttons) lives in the `UI` dictionary below.

export const LOCALES = ['en', 'id'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'preferred-locale'
export const LOCALE_COOKIE = 'locale'

/** A piece of text available in one or more locales. */
export interface LocalizedText {
  en?: string
  id?: string
}

/** Accepts either a bilingual object or a plain string (legacy / non-translated). */
export type MaybeLocalized = LocalizedText | string | null | undefined

const otherLocale = (locale: Locale): Locale => (locale === 'en' ? 'id' : 'en')

/**
 * Resolve a bilingual value to a string for the active locale, falling back to
 * the other locale when the requested one is empty. Plain strings pass through.
 */
export const pickLocale = (value: MaybeLocalized, locale: Locale): string => {
  if (value == null) return ''
  if (typeof value === 'string') return value
  const primary = value[locale]
  if (typeof primary === 'string' && primary.trim()) return primary
  const fallback = value[otherLocale(locale)]
  return typeof fallback === 'string' ? fallback : ''
}

/** Expand any bilingual value into a fully-populated { en, id } pair for editing. */
export const toBilingual = (value: MaybeLocalized): { en: string; id: string } => {
  if (value == null) return { en: '', id: '' }
  if (typeof value === 'string') return { en: value, id: '' }
  return { en: value.en ?? '', id: value.id ?? '' }
}

/** True when a bilingual value has any non-empty content. */
export const hasLocalizedContent = (value: MaybeLocalized): boolean => {
  if (value == null) return false
  if (typeof value === 'string') return value.trim().length > 0
  return Boolean(value.en?.trim() || value.id?.trim())
}

// ---------------------------------------------------------------------------
// UI chrome dictionary (static labels, not user content).
// ---------------------------------------------------------------------------

export interface UIStrings {
  languageName: string
  switchTo: string
  loading: string
  loadingHint: string
  backToMenu: string
  backToList: string
  // Bio
  portfolioBio: string
  location: string
  availability: string
  highlights: string
  coreSkills: string
  experience: string
  // Projects
  projects: string
  selectedWork: string
  detailProject: string
  projectDetail: string
  gallery: string
  responsibilities: string
  techStack: string
  role: string
  year: string
  // Projects: categories & search
  projectTypes: string
  chooseType: string
  searchPlaceholder: string
  backToTypes: string
  otherType: string
  projectsUnit: string
  searchResults: string
  noResults: string
  // Skills
  skillsExpertise: string
  capabilities: string
  // Contact
  contact: string
  contactHeadline1: string
  contactHeadline2: string
  contactHeadline3: string
  contactIntro: string
  contactIntroEmphasis: string
}

export const UI: Record<Locale, UIStrings> = {
  en: {
    languageName: 'English',
    switchTo: 'Bahasa Indonesia',
    loading: 'Preparing the portfolio',
    loadingHint: 'Just a moment…',
    backToMenu: 'Back to menu',
    backToList: '← Back to List',
    portfolioBio: 'Portfolio Bio',
    location: 'Location',
    availability: 'Availability',
    highlights: 'Highlights',
    coreSkills: 'Core Skills',
    experience: 'Experience',
    projects: 'Projects',
    selectedWork: 'Selected Work',
    detailProject: 'Detail Project',
    projectDetail: 'Project Detail',
    gallery: 'Gallery',
    responsibilities: 'Responsibilities',
    techStack: 'Tech Stack',
    role: 'Role',
    year: 'Year',
    projectTypes: 'Project Types',
    chooseType: 'Choose a type to explore',
    searchPlaceholder: 'Search projects…',
    backToTypes: '← All types',
    otherType: 'Other',
    projectsUnit: 'projects',
    searchResults: 'Search results',
    noResults: 'No projects found.',
    skillsExpertise: 'Achievements & Certifications',
    capabilities: 'Verified Expertise',
    contact: 'Contact',
    contactHeadline1: "Let's Build",
    contactHeadline2: 'Something',
    contactHeadline3: 'Great.',
    contactIntro:
      'Open to freelance projects, product collaborations, and full-time roles. Have an idea that needs design-to-code execution?',
    contactIntroEmphasis: "Let's make it real.",
  },
  id: {
    languageName: 'Bahasa Indonesia',
    switchTo: 'English',
    loading: 'Menyiapkan portofolio',
    loadingHint: 'Mohon tunggu sebentar…',
    backToMenu: 'Kembali ke menu',
    backToList: '← Kembali ke Daftar',
    portfolioBio: 'Bio Portfolio',
    location: 'Lokasi',
    availability: 'Ketersediaan',
    highlights: 'Sorotan',
    coreSkills: 'Keahlian Inti',
    experience: 'Pengalaman',
    projects: 'Proyek',
    selectedWork: 'Karya Pilihan',
    detailProject: 'Lihat Detail',
    projectDetail: 'Detail Proyek',
    gallery: 'Galeri',
    responsibilities: 'Tanggung Jawab',
    techStack: 'Teknologi',
    role: 'Peran',
    year: 'Tahun',
    projectTypes: 'Jenis Proyek',
    chooseType: 'Pilih jenis untuk menjelajah',
    searchPlaceholder: 'Cari proyek…',
    backToTypes: '← Semua jenis',
    otherType: 'Lainnya',
    projectsUnit: 'proyek',
    searchResults: 'Hasil pencarian',
    noResults: 'Tidak ada proyek yang cocok.',
    skillsExpertise: 'Pencapaian & Sertifikasi',
    capabilities: 'Keahlian Terverifikasi',
    contact: 'Kontak',
    contactHeadline1: 'Mari Wujudkan',
    contactHeadline2: 'Sesuatu',
    contactHeadline3: 'yang Hebat.',
    contactIntro:
      'Terbuka untuk proyek freelance, kolaborasi produk, dan posisi full-time. Punya ide yang butuh eksekusi dari desain ke kode?',
    contactIntroEmphasis: 'Mari wujudkan bersama.',
  },
}

export const isLocale = (value: unknown): value is Locale =>
  value === 'en' || value === 'id'

// ---------------------------------------------------------------------------
// Client-side locale persistence + detection (no-ops on the server).
// ---------------------------------------------------------------------------

const readCookieLocale = (): Locale | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)locale=(en|id)/)
  return match ? (match[1] as Locale) : null
}

/** Best-effort initial locale: stored preference → cookie → browser → default. */
export const getInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // ignore storage access errors
  }
  const cookieLocale = readCookieLocale()
  if (cookieLocale) return cookieLocale
  const nav = window.navigator?.language?.toLowerCase() ?? ''
  if (nav.startsWith('id')) return 'id'
  return DEFAULT_LOCALE
}

/** Persist the chosen locale to localStorage + cookie (client only). */
export const persistLocale = (locale: Locale): void => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // ignore storage access errors
  }
  if (typeof document !== 'undefined') {
    // 1 year, site-wide.
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
  }
}
