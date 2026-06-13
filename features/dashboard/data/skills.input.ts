import type { LocalizedText } from '../i18n'
import type { SkillInput } from './skills.write'

const asString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : ''

const asNullableString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
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

export const parseSkillInput = (body: unknown): SkillInput | null => {
  if (!body || typeof body !== 'object') return null
  const raw = body as Record<string, unknown>

  const name = asLocalized(raw.name)
  if (!hasContent(name)) return null

  return {
    name,
    description: asLocalized(raw.description),
    imageId: asNullableString(raw.imageId),
    themeKey: asNullableString(raw.themeKey ?? raw.bgClass),
  }
}

export type { SkillInput }
