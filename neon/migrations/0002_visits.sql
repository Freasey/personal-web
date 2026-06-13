-- Migration: visitor tracking.
--
-- Adds a `visits` table that logs one row per public-site page view, so the
-- dashboard can show who is accessing the site (IP, device, browser, OS,
-- location) instead of static placeholder stats. No translatable text here:
-- everything is identifiers, enums, or plain technical strings.
--
-- Apply via psql or the Neon SQL editor. Safe to run more than once.

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

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
