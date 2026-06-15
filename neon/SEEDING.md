# Portfolio seeding — agent guide

This folder holds the bridge that turns a project into a portfolio entry in the
live **Neon** database that powers this site. When the user says *"make a
portfolio for project X"*, the workflow is:

1. **Read project X** (its repo/code) and write the portfolio content.
2. **Produce a JSON file** matching the shape below (one object, or an array).
3. **Run the seeder** to upsert it into Neon.
4. The user reviews/edits the result in the dashboard (`/dashboard/projects`)
   and runs Auto-translate to fill the Indonesian side.

## Files

- `seed-projects.mjs` — the seeder. Reads a JSON file and upserts projects.
- `seed-categories.sql` — seeds the 5 master categories (run once; idempotent).
- `schema.sql` — full Neon schema (source of truth; recreate the DB from this).

## How to run

```bash
# from the personal-web/ directory
node neon/seed-projects.mjs <path-to.json>            # insert/update
node neon/seed-projects.mjs <path-to.json> --inactive # seed as hidden drafts
```

`DATABASE_URL` is read from the environment, falling back to `personal-web/.env`.
Generate the JSON, run the command, then delete the temp JSON if it was scratch.

## JSON shape

Translatable fields accept a **plain string** (treated as English) **or** a
bilingual object `{ "en": "...", "id": "..." }`. Tech names, slug, and image
ids stay plain text. `category` is matched by name (English or Indonesian,
case-insensitive) against `project_categories`.

```json
{
  "name": "My Project",
  "slug": "my-project",
  "category": "Backend & API",
  "summary": "Short 5-10 word tagline",
  "description": "~40 word description of the project.",
  "role": "Backend Engineer",
  "year": 2024,
  "isActive": true,
  "sortOrder": 1,
  "stack": ["Node.js", "PostgreSQL", "..."],
  "highlights": ["Interesting thing one", "Interesting thing two"],
  "responsibilities": ["What I built / owned", "..."],
  "gallery": [
    "Caption of an endpoint/feature to document with image or video",
    { "caption": { "en": "...", "id": "..." }, "imageId": "<asset-uuid>" }
  ]
}
```

Field → table mapping (matches the portfolio questions):

| JSON field         | Table / column                          |
| ------------------ | --------------------------------------- |
| `name`             | `projects.name` (plain text)            |
| `slug`             | `projects.slug` (upsert key; auto from name if omitted) |
| `category`         | `projects.category_id` (resolved by name) |
| `summary`          | `projects.summary` (jsonb)              |
| `description`      | `projects.description` (jsonb)          |
| `role`             | `projects.role` (jsonb)                 |
| `year`             | `projects.year` (int, nullable)         |
| `stack[]`          | `project_stacks.stack_name` (plain text) |
| `highlights[]`     | `project_highlights.content` (jsonb)    |
| `responsibilities[]` | `project_responsibilities.content` (jsonb) |
| `gallery[]`        | `project_gallery.caption` (jsonb) + `asset_id` |

## Behaviour & gotchas

- **Upsert key is `slug`.** If `slug` is omitted it is derived from `name`
  (e.g. "Porto Sales API" → `porto-sales-api`). Re-running the same JSON updates
  in place (delete-by-slug then insert; children cascade) — no duplicates.
- A project edited in the dashboard may have its `slug` cleared (the form has no
  slug field). Re-seeding such a project by slug will **not** match it and will
  create a duplicate. Treat dashboard-curated projects as owned by the dashboard
  and don't re-seed them.
- Gallery rows are seeded with `caption` only; `asset_id` is null. The user
  attaches the actual image/video in the dashboard.
- `category` must already exist (run `seed-categories.sql` once). Unknown
  category names resolve to `null` with a warning, not an error.
- Seeding writes to the **live** database; `is_active: true` makes the project
  appear publicly immediately. Use `--inactive` for drafts.
