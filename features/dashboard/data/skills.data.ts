import type { RawSkillItem } from '../types'

export const getSkillsGallery = (blobUrl: Record<string, string> | null): RawSkillItem[] => [
  {
    id: 'skill-1',
    name: { en: 'Frontend Architecture', id: 'Arsitektur Frontend' },
    description: {
      en: 'Scalable UI systems, component libraries, and design token workflows.',
      id: 'Sistem UI yang skalabel, pustaka komponen, dan alur kerja design token.',
    },
    image: blobUrl?.['skill-frontend.jpeg'],
    bgClass: 'from-sky-900 via-slate-900 to-slate-800',
  },
  {
    id: 'skill-2',
    name: { en: 'Backend Integration', id: 'Integrasi Backend' },
    description: {
      en: 'API design, auth flows, and reliable data fetching patterns.',
      id: 'Desain API, alur autentikasi, dan pola pengambilan data yang andal.',
    },
    image: blobUrl?.['skill-backend.jpeg'],
    bgClass: 'from-emerald-900 via-teal-900 to-slate-800',
  },
  {
    id: 'skill-3',
    name: { en: 'Product Delivery', id: 'Pengiriman Produk' },
    description: {
      en: 'MVP launches, performance tuning, and cross-team collaboration.',
      id: 'Peluncuran MVP, optimasi performa, dan kolaborasi lintas tim.',
    },
    image: blobUrl?.['skill-product.jpeg'],
    bgClass: 'from-orange-900 via-rose-900 to-slate-800',
  },
]
