import type { LocalizedText } from '../i18n'
import type {
  ProjectGalleryInput,
  ProjectInput,
} from './projects.write'

const asString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

const asNullableString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const asNullableNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const parsed = Number(trimmed)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

/** Accept a bilingual { en, id } object or a plain string (treated as English). */
const asLocalized = (value: unknown): LocalizedText => {
  if (typeof value === 'string') {
    const en = value.trim()
    return en ? { en } : {}
  }
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const en = asString(obj.en)
    const id = asString(obj.id)
    const out: LocalizedText = {}
    if (en) out.en = en
    if (id) out.id = id
    return out
  }
  return {}
}

const hasContent = (value: LocalizedText): boolean => Boolean(value.en || value.id)

const asLocalizedArray = (value: unknown): LocalizedText[] =>
  Array.isArray(value) ? value.map(asLocalized).filter(hasContent) : []

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.map(asString).filter((item) => item.length > 0)
    : []

const asGalleryArray = (value: unknown): ProjectGalleryInput[] => {
  if (!Array.isArray(value)) return []
  const result: ProjectGalleryInput[] = []
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue
    const item = raw as Record<string, unknown>
    const caption = asLocalized(item.caption)
    const imageId = asNullableString(item.imageId)
    if (!hasContent(caption) && !imageId) continue
    result.push({
      caption,
      imageId,
    })
  }
  return result
}

export const parseProjectInput = (body: unknown): ProjectInput | null => {
  if (!body || typeof body !== 'object') return null
  const raw = body as Record<string, unknown>

  const name = asString(raw.name)
  if (!name) return null

  return {
    name,
    slug: asNullableString(raw.slug),
    summary: asLocalized(raw.summary),
    description: asLocalized(raw.description),
    imageId: asNullableString(raw.imageId),
    categoryId: asNullableString(raw.categoryId),
    year: asNullableNumber(raw.year),
    role: asLocalized(raw.role),
    stack: asStringArray(raw.stack),
    highlights: asLocalizedArray(raw.highlights),
    responsibilities: asLocalizedArray(raw.responsibilities),
    gallery: asGalleryArray(raw.gallery),
  }
}

// Re-export to satisfy unused import linting in callers if needed.
export type { ProjectInput, ProjectGalleryInput }
