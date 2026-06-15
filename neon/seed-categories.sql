-- Seed: default project categories (jenis proyek).
--
-- Run AFTER neon/schema.sql. Inserts the five
-- starter types with real UUID ids so they show up in the dashboard project
-- dropdown and the public type grid. Idempotent: only seeds when the table is
-- empty, so re-running won't create duplicates.

insert into project_categories (name, description, sort_order)
select v.name::jsonb, v.description::jsonb, v.sort_order
from (values
  ('{"en":"Web Application","id":"Aplikasi Web"}',
   '{"en":"Web apps, dashboards, and product MVPs.","id":"Aplikasi web, dashboard, dan MVP produk."}', 0),
  ('{"en":"Mobile Application","id":"Aplikasi Mobile"}',
   '{"en":"iOS, Android, and cross-platform apps.","id":"Aplikasi iOS, Android, dan lintas platform."}', 1),
  ('{"en":"Backend & API","id":"Backend & API"}',
   '{"en":"APIs, services, and data layers.","id":"API, service, dan lapisan data."}', 2),
  ('{"en":"AI / Machine Learning","id":"AI / Machine Learning"}',
   '{"en":"Models, pipelines, and AI-powered features.","id":"Model, pipeline, dan fitur bertenaga AI."}', 3),
  ('{"en":"Automation & Internal Tools","id":"Otomasi & Tool Internal"}',
   '{"en":"Scripts, integrations, and internal tooling.","id":"Skrip, integrasi, dan tooling internal."}', 4)
) as v(name, description, sort_order)
where not exists (select 1 from project_categories);
