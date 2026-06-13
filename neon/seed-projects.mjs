// Generic, data-driven project seeder for the personal-web Neon database.
//
// Reads a JSON file describing one or more projects and upserts each into
// `projects` (+ project_stacks / project_highlights / project_responsibilities
// / project_gallery). Idempotent per slug: a project with a matching slug is
// deleted (children cascade) then re-inserted -- safe to re-run, but it WILL
// overwrite manual dashboard edits for any slug present in the JSON.
//
// Usage:
//   node neon/seed-projects.mjs                         (defaults to neon/projects.seed.json)
//   node neon/seed-projects.mjs neon/my-projects.json
//   node neon/seed-projects.mjs neon/projects.seed.json --inactive   (seed as hidden drafts)
//   node --env-file=.env neon/seed-projects.mjs ...     (if DATABASE_URL is not already exported)
//
// JSON shape (array of projects, or a single project object):
//   {
//     "slug": "my-project",            // required, used as the upsert key
//     "name": "My Project",            // required
//     "summary": "short tagline",
//     "description": "~40 word blurb",
//     "role": "Backend Engineer",
//     "year": 2024,
//     "isActive": true,                // optional; CLI --inactive overrides to false for all
//     "sortOrder": 1,                  // optional; defaults to file order
//     "stack": ["Node.js", "..."],
//     "highlights": ["...", "..."],
//     "responsibilities": ["...", "..."],
//     "gallery": ["caption", { "caption": "...", "imageId": "<asset-uuid>" }]
//   }

import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { neon } from '@neondatabase/serverless'

// --- args --------------------------------------------------------------------
const argv = process.argv.slice(2)
const FORCE_INACTIVE = argv.includes('--inactive')
const dataPathArg = argv.find((a) => !a.startsWith('--'))
const dataUrl = dataPathArg
  ? new URL(dataPathArg, `file://${process.cwd()}/`)
  : new URL('./projects.seed.json', import.meta.url)

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

// --- normalize ---------------------------------------------------------------
const asString = (v) => (typeof v === 'string' ? v.trim() : '')
const asStringArray = (v) =>
  Array.isArray(v) ? v.map(asString).filter(Boolean) : []

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

const asGallery = (v) => {
  if (!Array.isArray(v)) return []
  const out = []
  for (const raw of v) {
    if (typeof raw === 'string' || (raw && typeof raw === 'object' && !('caption' in raw))) {
      const caption = asLocalizedJson(raw)
      if (caption) out.push({ caption, imageId: null })
    } else if (raw && typeof raw === 'object') {
      const caption = asLocalizedJson(raw.caption)
      const imageId = asString(raw.imageId) || null
      if (caption || imageId) out.push({ caption, imageId })
    }
  }
  return out
}

function normalize(raw, index) {
  const slug = asString(raw.slug)
  const name = asString(raw.name)
  if (!slug) throw new Error(`Project #${index + 1} is missing "slug".`)
  if (!name) throw new Error(`Project "${slug}" is missing "name".`)
  return {
    slug,
    name,
    summary: asLocalizedJson(raw.summary),
    description: asLocalizedJson(raw.description),
    role: asLocalizedJson(raw.role),
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
      insert into projects (id, name, slug, summary, description, year, role, sort_order, is_active)
      values (${id}, ${p.name}, ${p.slug}, ${p.summary}::jsonb, ${p.description}::jsonb,
              ${p.year}, ${p.role}::jsonb, ${p.sortOrder}, ${p.isActive})`,
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
  const projects = list.map(normalize)

  console.log(
    `Seeding ${projects.length} project(s) from ${dataUrl.pathname}` +
      (FORCE_INACTIVE ? ' (forced is_active=false)' : ''),
  )
  for (const p of projects) {
    const id = await seedProject(p)
    console.log(`  ✓ ${p.name}  [${p.slug}]  is_active=${p.isActive}  -> ${id}`)
  }
  console.log('Done.')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
