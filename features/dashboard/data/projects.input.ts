import type {
  ProjectGalleryInput,
  ProjectInput,
} from './projects.write'

const asString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

const asOptionalString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

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
    const caption = asString(item.caption)
    const imageId = asNullableString(item.imageId)
    if (!caption && !imageId) continue
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
    summary: asString(raw.summary),
    description: asString(raw.description),
    imageId: asNullableString(raw.imageId),
    year: asNullableNumber(raw.year),
    role: asString(raw.role),
    stack: asStringArray(raw.stack),
    highlights: asStringArray(raw.highlights),
    responsibilities: asStringArray(raw.responsibilities),
    gallery: asGalleryArray(raw.gallery),
  }
}

// Re-export to satisfy unused import linting in callers if needed.
export type { ProjectInput, ProjectGalleryInput }
// asOptionalString is kept for future fields that should be omitted vs cleared.
void asOptionalString
