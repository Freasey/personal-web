import 'server-only'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { getSql } from '@/lib/db'
import type { LocalizedText } from '../i18n'

export interface ProfileExperienceInput {
  role: LocalizedText
  company: string
  period: string
  details: LocalizedText
}

export interface ProfileInput {
  name: string
  role: LocalizedText
  location: LocalizedText
  summary: LocalizedText
  availability: LocalizedText
  highlights: LocalizedText[]
  skills: string[]
  experience: ProfileExperienceInput[]
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
    revalidatePath('/dashboard/profile')
  } catch {
    // swallow
  }
}

// Build the parameterized child-row insert queries for a profile. Returned
// unexecuted so they can run inside a single sql.transaction([...]).
const childInsertQueries = (
  sql: ReturnType<typeof getSql>,
  profileId: string,
  input: ProfileInput,
) => {
  const queries: ReturnType<typeof sql>[] = []

  input.highlights.forEach((value, index) => {
    queries.push(sql`
      insert into profile_highlights (profile_id, content, sort_order, is_active)
      values (${profileId}, ${toJsonb(value)}::jsonb, ${index}, true)`)
  })
  input.skills.forEach((value, index) => {
    queries.push(sql`
      insert into profile_skills (profile_id, name, sort_order, is_active)
      values (${profileId}, ${value}, ${index}, true)`)
  })
  input.experience.forEach((value, index) => {
    queries.push(sql`
      insert into profile_experiences (profile_id, role, company, period, details, sort_order, is_active)
      values (${profileId}, ${toJsonb(value.role)}::jsonb, ${value.company}, ${value.period},
              ${toJsonb(value.details)}::jsonb, ${index}, true)`)
  })

  return queries
}

/**
 * Upsert the (singleton) public profile and replace its highlights, core
 * skills, and experience. Creates the profile row the first time.
 */
export const saveProfile = async (input: ProfileInput): Promise<void> => {
  const sql = getSql()

  const existing = (await sql`
    select id from profiles where is_active = true order by sort_order asc limit 1
  `) as { id: string }[]

  const id = existing[0]?.id ?? randomUUID()
  const isNew = !existing[0]

  const upsert = isNew
    ? sql`
        insert into profiles (id, name, role, location, summary, availability, is_active, sort_order)
        values (${id}, ${input.name}, ${toJsonb(input.role)}::jsonb, ${toJsonb(input.location)}::jsonb,
                ${toJsonb(input.summary)}::jsonb, ${toJsonb(input.availability)}::jsonb, true, 0)`
    : sql`
        update profiles set
          name = ${input.name},
          role = ${toJsonb(input.role)}::jsonb,
          location = ${toJsonb(input.location)}::jsonb,
          summary = ${toJsonb(input.summary)}::jsonb,
          availability = ${toJsonb(input.availability)}::jsonb,
          updated_at = now()
        where id = ${id}`

  await sql.transaction([
    upsert,
    sql`delete from profile_highlights where profile_id = ${id}`,
    sql`delete from profile_skills where profile_id = ${id}`,
    sql`delete from profile_experiences where profile_id = ${id}`,
    ...childInsertQueries(sql, id, input),
  ])

  revalidatePublic()
}
