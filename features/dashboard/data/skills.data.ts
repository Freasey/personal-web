import type { SkillItem } from '../types'

export const getSkillsGallery = (blobUrl: Record<string, string> | null): SkillItem[] => [
  {
    id: 'skill-1',
    name: 'Frontend Architecture',
    description: 'Scalable UI systems, component libraries, and design token workflows.',
    image: blobUrl?.['skill-frontend.jpeg'],
    bgClass: 'from-sky-900 via-slate-900 to-slate-800'
  },
  {
    id: 'skill-2',
    name: 'Backend Integration',
    description: 'API design, auth flows, and reliable data fetching patterns.',
    image: blobUrl?.['skill-backend.jpeg'],
    bgClass: 'from-emerald-900 via-teal-900 to-slate-800'
  },
  {
    id: 'skill-3',
    name: 'Product Delivery',
    description: 'MVP launches, performance tuning, and cross-team collaboration.',
    image: blobUrl?.['skill-product.jpeg'],
    bgClass: 'from-orange-900 via-rose-900 to-slate-800'
  }
]
