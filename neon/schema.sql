-- NeonDB schema for personal-web (migrated from Supabase/PostgREST).
-- Plain Postgres: no RLS, no Supabase auth/storage assumptions.
-- Single source of truth: run this once against a fresh Neon database, then
-- run neon/seed-categories.sql to populate the project categories.
--
-- i18n: user-authored, translatable text is stored as jsonb { "en": "...",
-- "id": "..." } so the site can switch between English and Indonesian. Plain
-- text is reserved for identifiers, URLs, tech names, dates, and enums.

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ---------------------------------------------------------------------------
-- assets: media metadata. Files now live in Vercel Blob; public_url points there.
-- ---------------------------------------------------------------------------
create table if not exists assets (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null default 'image' check (kind in ('image', 'video')),
  file_name    text not null,
  storage_path text not null,
  public_url   text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- profiles + children
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id           uuid primary key default gen_random_uuid(),
  name         text,
  role         jsonb,  -- { en, id }
  location     jsonb,  -- { en, id }
  summary      jsonb,  -- { en, id }
  availability jsonb,  -- { en, id }
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists profile_highlights (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  content    jsonb,  -- { en, id }
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profile_skills (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  name       text,   -- tech names: not translated
  category   text,
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profile_experiences (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  role       jsonb,  -- { en, id }
  company    text,
  period     text,
  details    jsonb,  -- { en, id }
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- projects + children
-- ---------------------------------------------------------------------------
-- project_categories: master "jenis proyek" used to group projects on the
-- public site (Web Application, Mobile Application, Backend & API, …).
create table if not exists project_categories (
  id          uuid primary key default gen_random_uuid(),
  name        jsonb,  -- { en, id }
  description jsonb,  -- { en, id }
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  slug        text,
  summary     jsonb,  -- { en, id }
  description jsonb,  -- { en, id }
  image_id    uuid references assets(id) on delete set null,
  category_id uuid references project_categories(id) on delete set null,
  year        integer,
  role        jsonb,  -- { en, id }
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_category_id_idx on projects (category_id);

create table if not exists project_gallery (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  asset_id   uuid references assets(id) on delete set null,
  caption    jsonb,  -- { en, id }
  theme_key  text,
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_stacks (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  stack_name text,   -- tech names: not translated
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_highlights (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  content    jsonb,  -- { en, id }
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_responsibilities (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  content    jsonb,  -- { en, id }
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- skill_items, contacts
-- ---------------------------------------------------------------------------
-- Note: the homepage navigation cards live in the UI (features/dashboard/data/
-- cards.data.ts), not the database. The former `dashboard_cards` table is no
-- longer used and can be dropped (see neon/SEEDING.md / DROP TABLE dashboard_cards).
create table if not exists skill_items (
  id          uuid primary key default gen_random_uuid(),
  name        jsonb,  -- { en, id }
  description jsonb,  -- { en, id }
  image_id    uuid references assets(id) on delete set null,
  theme_key   text,
  category    text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists contacts (
  id           uuid primary key default gen_random_uuid(),
  label        jsonb,  -- { en, id }
  value        text,   -- email / phone / handle: not translated
  hint         jsonb,  -- { en, id }
  contact_type text,
  icon_key     text,
  href         text,
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- visits: one row per public-site page view, for the dashboard analytics.
-- Plain technical strings only (IP, user-agent, parsed device/browser/os,
-- geo from request headers). See neon/migrations/0002_visits.sql.
-- ---------------------------------------------------------------------------
create table if not exists visits (
  id          uuid primary key default gen_random_uuid(),
  visitor_id  text,                         -- stable per-browser id (cookie)
  ip_address  text,
  user_agent  text,
  device      text,                         -- Mobile / Tablet / Desktop / Bot
  browser     text,
  os          text,
  path        text,
  referrer    text,
  country     text,                         -- from x-vercel-ip-country
  city        text,                         -- from x-vercel-ip-city
  is_new      boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists visits_created_at_idx on visits (created_at desc);
create index if not exists visits_visitor_id_idx on visits (visitor_id);
