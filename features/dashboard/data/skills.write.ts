import 'server-only'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { getSql } from '@/lib/db'
import type { LocalizedText } from '../i18n'

export interface SkillInput {
  name: LocalizedText
  description: LocalizedText
  imageId?: string | null
  themeKey?: string | null
  sort_order?: number
  is_active?: boolean
}

/** Serialize a bilingual value for a jsonb column, or null when empty. */
const toJsonb = (value: LocalizedText | null | undefined): string | null => {
  if (!value) return null
  const en = value.en?.trim()
  const id = value.id?.trim()
  if (!en && !id) return null
  const out: LocalizedText = {}
  if (en) out.en = en
  if (id) out.id = id
  return JSON.stringify(out)
}

const revalidatePublic = () => {
  try {
    revalidatePath('/')
    revalidatePath('/dashboard/skills')
  } catch {
    // swallow
  }
}

export const createSkill = async (input: SkillInput): Promise<string> => {
  const sql = getSql()
  const id = randomUUID()

  await sql`
    insert into skill_items (id, name, description, image_id, theme_key, sort_order, is_active)
    values (${id}, ${toJsonb(input.name)}::jsonb, ${toJsonb(input.description)}::jsonb,
            ${input.imageId ?? null}, ${input.themeKey ?? null}, ${input.sort_order ?? 0},
            ${input.is_active ?? true})`

  revalidatePublic()
  return id
}

export const updateSkill = async (id: string, input: SkillInput): Promise<void> => {
  const sql = getSql()

  await sql`
    update skill_items set
      name = ${toJsonb(input.name)}::jsonb,
      description = ${toJsonb(input.description)}::jsonb,
      image_id = ${input.imageId ?? null},
      theme_key = ${input.themeKey ?? null},
      sort_order = ${input.sort_order ?? 0},
      is_active = ${input.is_active ?? true},
      updated_at = now()
    where id = ${id}`

  revalidatePublic()
}

export const deleteSkill = async (id: string): Promise<void> => {
  const sql = getSql()
  await sql`delete from skill_items where id = ${id}`
  revalidatePublic()
}
