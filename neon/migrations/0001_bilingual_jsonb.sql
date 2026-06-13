-- Migration: make user-authored text bilingual.
--
-- Converts translatable text columns to jsonb { "en": "...", "id": "..." }.
-- Existing values are preserved as the English ("en") side; the Indonesian
-- ("id") side starts empty and can be filled from the dashboard (manually or
-- via Auto-translate). Identifiers, URLs, tech names, dates and enums are left
-- as plain text.
--
-- Run EXACTLY ONCE, against a text-based schema (the original tables). Running
-- it again on already-jsonb columns would double-wrap the values. Apply via psql
-- or the Neon SQL editor.

-- Helper pattern: text -> jsonb_build_object('en', <text>), NULL stays NULL.

-- profiles ------------------------------------------------------------------
alter table profiles
  alter column role type jsonb using (case when role is null then null else jsonb_build_object('en', role::text) end),
  alter column location type jsonb using (case when location is null then null else jsonb_build_object('en', location::text) end),
  alter column summary type jsonb using (case when summary is null then null else jsonb_build_object('en', summary::text) end),
  alter column availability type jsonb using (case when availability is null then null else jsonb_build_object('en', availability::text) end);

alter table profile_highlights
  alter column content type jsonb using (case when content is null then null else jsonb_build_object('en', content::text) end);

alter table profile_experiences
  alter column role type jsonb using (case when role is null then null else jsonb_build_object('en', role::text) end),
  alter column details type jsonb using (case when details is null then null else jsonb_build_object('en', details::text) end);

-- projects ------------------------------------------------------------------
alter table projects
  alter column summary type jsonb using (case when summary is null then null else jsonb_build_object('en', summary::text) end),
  alter column description type jsonb using (case when description is null then null else jsonb_build_object('en', description::text) end),
  alter column role type jsonb using (case when role is null then null else jsonb_build_object('en', role::text) end);

alter table project_gallery
  alter column caption type jsonb using (case when caption is null then null else jsonb_build_object('en', caption::text) end);

alter table project_highlights
  alter column content type jsonb using (case when content is null then null else jsonb_build_object('en', content::text) end);

alter table project_responsibilities
  alter column content type jsonb using (case when content is null then null else jsonb_build_object('en', content::text) end);

-- dashboard_cards -----------------------------------------------------------
alter table dashboard_cards
  alter column title type jsonb using (case when title is null then null else jsonb_build_object('en', title::text) end),
  alter column subtitle type jsonb using (case when subtitle is null then null else jsonb_build_object('en', subtitle::text) end),
  alter column description type jsonb using (case when description is null then null else jsonb_build_object('en', description::text) end),
  alter column cta_label type jsonb using (case when cta_label is null then null else jsonb_build_object('en', cta_label::text) end);

-- skill_items ---------------------------------------------------------------
alter table skill_items
  alter column name type jsonb using (case when name is null then null else jsonb_build_object('en', name::text) end),
  alter column description type jsonb using (case when description is null then null else jsonb_build_object('en', description::text) end);

-- contacts ------------------------------------------------------------------
alter table contacts
  alter column label type jsonb using (case when label is null then null else jsonb_build_object('en', label::text) end),
  alter column hint type jsonb using (case when hint is null then null else jsonb_build_object('en', hint::text) end);
