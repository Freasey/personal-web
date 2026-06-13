import type { LocalizedText } from '../i18n'
import type { CategoryInput } from './categories.write'

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

export const parseCategoryInput = (body: unknown): CategoryInput | null => {
  if (!body || typeof body !== 'object') return null
  const raw = body as Record<string, unknown>

  const name = asLocalized(raw.name)
  if (!hasContent(name)) return null

  return {
    name,
    description: asLocalized(raw.description),
  }
}

export type { CategoryInput }
