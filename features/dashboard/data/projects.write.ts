import 'server-only'

import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseServiceRoleKey)

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

const ensureConfig = () => {
  if (!hasSupabaseConfig || !supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Supabase write requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.',
    )
  }
  return { url: supabaseUrl, key: supabaseServiceRoleKey }
}

const restHeaders = (key: string, prefer?: string) => {
  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (prefer) {
    headers.Prefer = prefer
  }
  return headers
}

const restFetch = async (
  path: string,
  init: RequestInit & { searchParams?: Record<string, string> } = {},
) => {
  const { url, key } = ensureConfig()
  const endpoint = new URL(`/rest/v1/${path}`, url)
  if (init.searchParams) {
    for (const [k, v] of Object.entries(init.searchParams)) {
      endpoint.searchParams.set(k, v)
    }
  }

  const response = await fetch(endpoint.toString(), {
    ...init,
    headers: { ...restHeaders(key, (init.headers as Record<string, string>)?.Prefer), ...(init.headers ?? {}) },
    cache: 'no-store',
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Supabase ${init.method ?? 'GET'} ${path} failed: ${response.status} ${text}`)
  }

  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

const insertChildren = async (
  table: string,
  rows: Record<string, unknown>[],
) => {
  if (rows.length === 0) return
  await restFetch(table, {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(rows),
  })
}

const deleteChildren = async (table: string, projectId: string) => {
  await restFetch(table, {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
    searchParams: { project_id: `eq.${projectId}` },
  })
}

const writeProjectChildren = async (projectId: string, input: ProjectInput) => {
  await Promise.all([
    insertChildren(
      'project_gallery',
      input.gallery.map((item, index) => ({
        project_id: projectId,
        asset_id: item.imageId ?? null,
        caption: item.caption,
        sort_order: index,
        is_active: true,
      })),
    ),
    insertChildren(
      'project_stacks',
      input.stack.map((value, index) => ({
        project_id: projectId,
        stack: value,
        sort_order: index,
        is_active: true,
      })),
    ),
    insertChildren(
      'project_highlights',
      input.highlights.map((value, index) => ({
        project_id: projectId,
        highlight: value,
        sort_order: index,
        is_active: true,
      })),
    ),
    insertChildren(
      'project_responsibilities',
      input.responsibilities.map((value, index) => ({
        project_id: projectId,
        responsibility: value,
        sort_order: index,
        is_active: true,
      })),
    ),
  ])
}

const buildProjectRow = (input: ProjectInput) => ({
  name: input.name,
  slug: input.slug ?? null,
  summary: input.summary || null,
  description: input.description || null,
  image_id: input.imageId ?? null,
  year: input.year ?? null,
  role: input.role || null,
  sort_order: input.sort_order ?? 0,
  is_active: input.is_active ?? true,
})

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
  const inserted = (await restFetch('projects', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify([buildProjectRow(input)]),
  })) as Array<{ id: string }> | null

  const projectId = inserted?.[0]?.id
  if (!projectId) {
    throw new Error('Failed to create project: missing id in response.')
  }

  await writeProjectChildren(projectId, input)
  revalidatePublic()
  return projectId
}

export const updateProject = async (id: string, input: ProjectInput) => {
  await restFetch('projects', {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    searchParams: { id: `eq.${id}` },
    body: JSON.stringify(buildProjectRow(input)),
  })

  await Promise.all([
    deleteChildren('project_gallery', id),
    deleteChildren('project_stacks', id),
    deleteChildren('project_highlights', id),
    deleteChildren('project_responsibilities', id),
  ])

  await writeProjectChildren(id, input)
  revalidatePublic()
}

export const deleteProject = async (id: string) => {
  await Promise.all([
    deleteChildren('project_gallery', id),
    deleteChildren('project_stacks', id),
    deleteChildren('project_highlights', id),
    deleteChildren('project_responsibilities', id),
  ])

  await restFetch('projects', {
    method: 'DELETE',
    headers: { Prefer: 'return=minimal' },
    searchParams: { id: `eq.${id}` },
  })

  revalidatePublic()
}

export const getProjectRowForEdit = async (
  id: string,
): Promise<{ project: ProjectRawRow; gallery: ProjectGalleryRawRow[] } | null> => {
  const projects = (await restFetch('projects', {
    method: 'GET',
    searchParams: { id: `eq.${id}`, select: '*' },
  })) as ProjectRawRow[] | null

  const project = projects?.[0]
  if (!project) return null

  const gallery = ((await restFetch('project_gallery', {
    method: 'GET',
    searchParams: {
      project_id: `eq.${id}`,
      select: '*',
      order: 'sort_order.asc',
    },
  })) as ProjectGalleryRawRow[] | null) ?? []

  return { project, gallery }
}
