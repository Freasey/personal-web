import type { LocalizedText } from '../i18n'
import type { ProfileExperienceInput, ProfileInput } from './profile.write'

const asString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

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

const asExperienceArray = (value: unknown): ProfileExperienceInput[] => {
  if (!Array.isArray(value)) return []
  const result: ProfileExperienceInput[] = []
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue
    const item = raw as Record<string, unknown>
    const role = asLocalized(item.role)
    const company = asString(item.company)
    const period = asString(item.period)
    const details = asLocalized(item.details)
    if (!hasContent(role) && !company && !period && !hasContent(details)) continue
    result.push({ role, company, period, details })
  }
  return result
}

export const parseProfileInput = (body: unknown): ProfileInput | null => {
  if (!body || typeof body !== 'object') return null
  const raw = body as Record<string, unknown>

  const name = asString(raw.name)
  if (!name) return null

  return {
    name,
    role: asLocalized(raw.role),
    location: asLocalized(raw.location),
    summary: asLocalized(raw.summary),
    availability: asLocalized(raw.availability),
    highlights: asLocalizedArray(raw.highlights),
    skills: asStringArray(raw.skills),
    experience: asExperienceArray(raw.experience),
  }
}

export type { ProfileInput, ProfileExperienceInput }
