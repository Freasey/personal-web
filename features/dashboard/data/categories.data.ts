import type { RawProjectCategory } from '../types'

// Static fallback "jenis proyek". Used when the database is empty/unreachable.
// Once categories exist in the DB they take over (matched by id).
export const getProjectCategories = (): RawProjectCategory[] => [
  {
    id: 'cat-web',
    name: { en: 'Web Application', id: 'Aplikasi Web' },
    description: {
      en: 'Web apps, dashboards, and product MVPs.',
      id: 'Aplikasi web, dashboard, dan MVP produk.',
    },
  },
  {
    id: 'cat-mobile',
    name: { en: 'Mobile Application', id: 'Aplikasi Mobile' },
    description: {
      en: 'iOS, Android, and cross-platform apps.',
      id: 'Aplikasi iOS, Android, dan lintas platform.',
    },
  },
  {
    id: 'cat-backend',
    name: { en: 'Backend & API', id: 'Backend & API' },
    description: {
      en: 'APIs, services, and data layers.',
      id: 'API, service, dan lapisan data.',
    },
  },
  {
    id: 'cat-ai',
    name: { en: 'AI / Machine Learning', id: 'AI / Machine Learning' },
    description: {
      en: 'Models, pipelines, and AI-powered features.',
      id: 'Model, pipeline, dan fitur bertenaga AI.',
    },
  },
  {
    id: 'cat-automation',
    name: { en: 'Automation & Internal Tools', id: 'Otomasi & Tool Internal' },
    description: {
      en: 'Scripts, integrations, and internal tooling.',
      id: 'Skrip, integrasi, dan tooling internal.',
    },
  },
]
