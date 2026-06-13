import 'server-only'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { getSql } from '@/lib/db'
import type { LocalizedText } from '../i18n'

export interface ContactInput {
  label: LocalizedText
  value: string
  hint: LocalizedText
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
    revalidatePath('/dashboard/contacts')
  } catch {
    // swallow
  }
}

export const createContact = async (input: ContactInput): Promise<string> => {
  const sql = getSql()
  const id = randomUUID()

  await sql`
    insert into contacts (id, label, value, hint, sort_order, is_active)
    values (${id}, ${toJsonb(input.label)}::jsonb, ${input.value}, ${toJsonb(input.hint)}::jsonb,
            ${input.sort_order ?? 0}, ${input.is_active ?? true})`

  revalidatePublic()
  return id
}

export const updateContact = async (id: string, input: ContactInput): Promise<void> => {
  const sql = getSql()

  await sql`
    update contacts set
      label = ${toJsonb(input.label)}::jsonb,
      value = ${input.value},
      hint = ${toJsonb(input.hint)}::jsonb,
      sort_order = ${input.sort_order ?? 0},
      is_active = ${input.is_active ?? true},
      updated_at = now()
    where id = ${id}`

  revalidatePublic()
}

export const deleteContact = async (id: string): Promise<void> => {
  const sql = getSql()
  await sql`delete from contacts where id = ${id}`
  revalidatePublic()
}
