import 'server-only'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { getSql } from '@/lib/db'
import type { LocalizedText } from '../i18n'

export interface CategoryInput {
  name: LocalizedText
  description: LocalizedText
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
    revalidatePath('/dashboard/categories')
    revalidatePath('/dashboard/projects')
  } catch {
    // swallow
  }
}

export const createCategory = async (input: CategoryInput): Promise<string> => {
  const sql = getSql()
  const id = randomUUID()

  await sql`
    insert into project_categories (id, name, description, sort_order, is_active)
    values (${id}, ${toJsonb(input.name)}::jsonb, ${toJsonb(input.description)}::jsonb,
            ${input.sort_order ?? 0}, ${input.is_active ?? true})`

  revalidatePublic()
  return id
}

export const updateCategory = async (id: string, input: CategoryInput): Promise<void> => {
  const sql = getSql()

  await sql`
    update project_categories set
      name = ${toJsonb(input.name)}::jsonb,
      description = ${toJsonb(input.description)}::jsonb,
      sort_order = ${input.sort_order ?? 0},
      is_active = ${input.is_active ?? true},
      updated_at = now()
    where id = ${id}`

  revalidatePublic()
}

export const deleteCategory = async (id: string): Promise<void> => {
  const sql = getSql()
  // Projects keep existing; their category_id is set null by the FK (on delete set null).
  await sql`delete from project_categories where id = ${id}`
  revalidatePublic()
}
