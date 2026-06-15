// Portfolio project seeder for the personal-web Neon database.
//
// Bridge used by an agent: when asked to "make a portfolio entry" for a project,
// generate a JSON file describing it (see neon/SEEDING.md for the shape and the
// agent workflow) and run this script to upsert it into Neon.
//
// Writes to: projects (+ project_stacks / project_highlights /
// project_responsibilities / project_gallery). Translatable text is stored as
// bilingual jsonb { "en": "...", "id": "..." }; tech names / slugs / urls stay
// plain text. Categories are resolved by name against project_categories.
//
// Idempotent per slug: a slug is derived from `name` when not given, then the
// matching project (and its cascade children) is deleted and re-inserted -- so
// re-running the same JSON updates in place instead of duplicating.
//
// Usage:
//   node neon/seed-projects.mjs <path-to.json>
//   node neon/seed-projects.mjs neon/_input.json --inactive
//   node --env-file=.env neon/seed-projects.mjs <path>   (if DATABASE_URL unset)

import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { neon } from '@neondatabase/serverless'

// --- args --------------------------------------------------------------------
const argv = process.argv.slice(2)
const FORCE_INACTIVE = argv.includes('--inactive')
const dataPathArg = argv.find((a) => !a.startsWith('--'))
if (!dataPathArg) {
  console.error('Usage: node neon/seed-projects.mjs <path-to.json> [--inactive]')
  process.exit(1)
}
const dataUrl = new URL(dataPathArg, `file://${process.cwd()}/`)

// --- load DATABASE_URL (process.env first, then ../.env) ---------------------
function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  try {
    const envText = readFileSync(new URL('../.env', import.meta.url), 'utf8')
    for (const line of envText.split('\n')) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*(.+)\s*$/)
      if (m) return m[1].trim().replace(/^["']|["']$/g, '')
    }
  } catch {
    /* ignore */
  }
  return null
}

const connectionString = loadDatabaseUrl()
if (!connectionString) {
  console.error('DATABASE_URL not found (checked process.env and ../.env).')
  process.exit(1)
}

const sql = neon(connectionString)

// --- helpers -----------------------------------------------------------------
const asString = (v) => (typeof v === 'string' ? v.trim() : '')
const asStringArray = (v) =>
  Array.isArray(v) ? v.map(asString).filter(Boolean) : []

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Translatable fields accept a plain string (treated as English) or a bilingual
// { en, id } object. Returns a JSON string for a jsonb column, or null if empty.
const asLocalizedJson = (v) => {
  let en = ''
  let id = ''
  if (typeof v === 'string') {
    en = v.trim()
  } else if (v && typeof v === 'object') {
    en = asString(v.en)
    id = asString(v.id)
  }
  if (!en && !id) return null
  const out = {}
  if (en) out.en = en
  if (id) out.id = id
  return JSON.stringify(out)
}
const asLocalizedJsonArray = (v) =>
  Array.isArray(v) ? v.map(asLocalizedJson).filter(Boolean) : []

// Gallery entries: a plain/bilingual caption, or { caption, imageId }.
const asGallery = (v) => {
  if (!Array.isArray(v)) return []
  const out = []
  for (const raw of v) {
    if (raw && typeof raw === 'object' && 'caption' in raw) {
      const caption = asLocalizedJson(raw.caption)
      const imageId = asString(raw.imageId) || null
      if (caption || imageId) out.push({ caption, imageId })
    } else {
      const caption = asLocalizedJson(raw)
      if (caption) out.push({ caption, imageId: null })
    }
  }
  return out
}

// --- category resolution -----------------------------------------------------
// Map a category name (en or id, case-insensitive) to its uuid. A raw uuid in
// `categoryId` is used as-is. Unknown names resolve to null with a warning.
let categoryCache = null
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function resolveCategoryId(raw) {
  const explicit = asString(raw.categoryId)
  if (explicit && UUID_RE.test(explicit)) return explicit

  const wanted = asString(raw.category)
  if (!wanted) return null

  if (!categoryCache) {
    const rows = await sql`select id, name from project_categories`
    categoryCache = rows.map((r) => {
      const name = typeof r.name === 'string' ? JSON.parse(r.name) : r.name || {}
      return { id: r.id, en: (name.en || '').toLowerCase(), id_: (name.id || '').toLowerCase() }
    })
  }
  const key = wanted.toLowerCase()
  const hit = categoryCache.find((c) => c.en === key || c.id_ === key)
  if (!hit) {
    console.warn(`  ! category "${wanted}" not found in project_categories -> null`)
    return null
  }
  return hit.id
}

// --- normalize ---------------------------------------------------------------
async function normalize(raw, index) {
  const name = asString(raw.name)
  if (!name) throw new Error(`Project #${index + 1} is missing "name".`)
  const slug = asString(raw.slug) || slugify(name)
  return {
    slug,
    name,
    summary: asLocalizedJson(raw.summary),
    description: asLocalizedJson(raw.description),
    role: asLocalizedJson(raw.role),
    categoryId: await resolveCategoryId(raw),
    year: Number.isFinite(raw.year) ? raw.year : null,
    isActive: FORCE_INACTIVE ? false : raw.isActive !== false,
    sortOrder: Number.isFinite(raw.sortOrder) ? raw.sortOrder : index + 1,
    stack: asStringArray(raw.stack),
    highlights: asLocalizedJsonArray(raw.highlights),
    responsibilities: asLocalizedJsonArray(raw.responsibilities),
    gallery: asGallery(raw.gallery),
  }
}

// --- seed --------------------------------------------------------------------
async function seedProject(p) {
  const id = randomUUID()
  const queries = [
    sql`delete from projects where slug = ${p.slug}`,
    sql`
      insert into projects
        (id, name, slug, summary, description, category_id, year, role, sort_order, is_active)
      values
        (${id}, ${p.name}, ${p.slug}, ${p.summary}::jsonb, ${p.description}::jsonb,
         ${p.categoryId}, ${p.year}, ${p.role}::jsonb, ${p.sortOrder}, ${p.isActive})`,
  ]
  p.gallery.forEach((g, i) =>
    queries.push(sql`
      insert into project_gallery (project_id, asset_id, caption, sort_order, is_active)
      values (${id}, ${g.imageId}, ${g.caption}::jsonb, ${i}, true)`),
  )
  p.stack.forEach((name, i) =>
    queries.push(sql`
      insert into project_stacks (project_id, stack_name, sort_order, is_active)
      values (${id}, ${name}, ${i}, true)`),
  )
  p.highlights.forEach((content, i) =>
    queries.push(sql`
      insert into project_highlights (project_id, content, sort_order, is_active)
      values (${id}, ${content}::jsonb, ${i}, true)`),
  )
  p.responsibilities.forEach((content, i) =>
    queries.push(sql`
      insert into project_responsibilities (project_id, content, sort_order, is_active)
      values (${id}, ${content}::jsonb, ${i}, true)`),
  )
  await sql.transaction(queries)
  return id
}

async function main() {
  let parsed
  try {
    parsed = JSON.parse(readFileSync(dataUrl, 'utf8'))
  } catch (err) {
    console.error(`Could not read/parse JSON at ${dataUrl.pathname}:`, err.message)
    process.exit(1)
  }
  const list = Array.isArray(parsed) ? parsed : [parsed]

  console.log(
    `Seeding ${list.length} project(s) from ${dataUrl.pathname}` +
      (FORCE_INACTIVE ? ' (forced is_active=false)' : ''),
  )
  for (let i = 0; i < list.length; i++) {
    const p = await normalize(list[i], i)
    const id = await seedProject(p)
    console.log(
      `  ✓ ${p.name}  [${p.slug}]  category=${p.categoryId ?? 'none'}  is_active=${p.isActive}  -> ${id}`,
    )
  }
  console.log('Done.')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
