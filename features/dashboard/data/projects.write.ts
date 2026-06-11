import 'server-only'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { getSql } from '@/lib/db'

export interface ProjectGalleryInput {
  imageId?: string | null
  caption: string
}

export interface ProjectInput {
  name: string
  slug?: string | null
  summary: string
  description: string
  imageId?: string | null
  year?: number | null
  role: string
  stack: string[]
  highlights: string[]
  responsibilities: string[]
  gallery: ProjectGalleryInput[]
  sort_order?: number
  is_active?: boolean
}

export interface ProjectRawRow {
  id: string
  name: string
  slug: string | null
  summary: string | null
  description: string | null
  image_id: string | null
  year: number | null
  role: string | null
  sort_order: number
  is_active: boolean
}

export interface ProjectGalleryRawRow {
  id: string
  project_id: string
  asset_id: string | null
  caption: string | null
  theme_key: string | null
  sort_order: number
}

// Build the parameterized child-row insert queries for a project. Returned
// unexecuted so they can run inside a single sql.transaction([...]).
const childInsertQueries = (
  sql: ReturnType<typeof getSql>,
  projectId: string,
  input: ProjectInput,
) => {
  const queries: ReturnType<typeof sql>[] = []

  input.gallery.forEach((item, index) => {
    queries.push(sql`
      insert into project_gallery (project_id, asset_id, caption, sort_order, is_active)
      values (${projectId}, ${item.imageId ?? null}, ${item.caption}, ${index}, true)`)
  })
  input.stack.forEach((value, index) => {
    queries.push(sql`
      insert into project_stacks (project_id, stack_name, sort_order, is_active)
      values (${projectId}, ${value}, ${index}, true)`)
  })
  input.highlights.forEach((value, index) => {
    queries.push(sql`
      insert into project_highlights (project_id, content, sort_order, is_active)
      values (${projectId}, ${value}, ${index}, true)`)
  })
  input.responsibilities.forEach((value, index) => {
    queries.push(sql`
      insert into project_responsibilities (project_id, content, sort_order, is_active)
      values (${projectId}, ${value}, ${index}, true)`)
  })

  return queries
}

const revalidatePublic = () => {
  try {
    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/dashboard/projects')
  } catch {
    // swallow
  }
}

export const createProject = async (input: ProjectInput): Promise<string> => {
  const sql = getSql()
  const id = randomUUID()

  await sql.transaction([
    sql`
      insert into projects (id, name, slug, summary, description, image_id, year, role, sort_order, is_active)
      values (${id}, ${input.name}, ${input.slug ?? null}, ${input.summary || null},
              ${input.description || null}, ${input.imageId ?? null}, ${input.year ?? null},
              ${input.role || null}, ${input.sort_order ?? 0}, ${input.is_active ?? true})`,
    ...childInsertQueries(sql, id, input),
  ])

  revalidatePublic()
  return id
}

export const updateProject = async (id: string, input: ProjectInput) => {
  const sql = getSql()

  await sql.transaction([
    sql`
      update projects set
        name = ${input.name},
        slug = ${input.slug ?? null},
        summary = ${input.summary || null},
        description = ${input.description || null},
        image_id = ${input.imageId ?? null},
        year = ${input.year ?? null},
        role = ${input.role || null},
        sort_order = ${input.sort_order ?? 0},
        is_active = ${input.is_active ?? true},
        updated_at = now()
      where id = ${id}`,
    sql`delete from project_gallery where project_id = ${id}`,
    sql`delete from project_stacks where project_id = ${id}`,
    sql`delete from project_highlights where project_id = ${id}`,
    sql`delete from project_responsibilities where project_id = ${id}`,
    ...childInsertQueries(sql, id, input),
  ])

  revalidatePublic()
}

export const deleteProject = async (id: string) => {
  const sql = getSql()

  // FK cascade also removes children, but delete explicitly to be safe.
  await sql.transaction([
    sql`delete from project_gallery where project_id = ${id}`,
    sql`delete from project_stacks where project_id = ${id}`,
    sql`delete from project_highlights where project_id = ${id}`,
    sql`delete from project_responsibilities where project_id = ${id}`,
    sql`delete from projects where id = ${id}`,
  ])

  revalidatePublic()
}

export const getProjectRowForEdit = async (
  id: string,
): Promise<{ project: ProjectRawRow; gallery: ProjectGalleryRawRow[] } | null> => {
  const sql = getSql()

  const projects = (await sql`select * from projects where id = ${id}`) as ProjectRawRow[]
  const project = projects[0]
  if (!project) return null

  const gallery = (await sql`
    select * from project_gallery where project_id = ${id} order by sort_order asc
  `) as ProjectGalleryRawRow[]

  return { project, gallery }
}
