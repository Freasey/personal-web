-- Migration: project categories (jenis proyek).
--
-- Adds a master `project_categories` table and a `category_id` foreign key on
-- `projects` so the public site can group projects by type (Web Application,
-- Mobile Application, Backend & API, etc.) and let visitors drill in by type.
--
-- `name`/`description` are translatable jsonb { "en": "...", "id": "..." }.
-- Apply via psql or the Neon SQL editor. Safe to run more than once.

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

create table if not exists project_categories (
  id          uuid primary key default gen_random_uuid(),
  name        jsonb,  -- { en, id }
  description jsonb,  -- { en, id }
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table projects
  add column if not exists category_id uuid references project_categories(id) on delete set null;

create index if not exists projects_category_id_idx on projects (category_id);
