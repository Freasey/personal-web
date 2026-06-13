import type { RawCardItem } from '../types'

// Gambar blob di-inject dari luar (via blobUrl)
export const getCards = (blobUrl: Record<string, string> | null): RawCardItem[] => [
  {
    id: 1,
    image: blobUrl?.['home-card.jpeg'],
    imageAlt: { en: 'Portrait of Daffa Ardhana', id: 'Potret Daffa Ardhana' },
    title: { en: 'Daffa Ardhana', id: 'Daffa Ardhana' },
    subtitle: { en: 'Fullstack Engineer', id: 'Fullstack Engineer' },
    description: {
      en: 'I build fast, reliable web apps and design systems with a product-first mindset.',
      id: 'Saya membangun aplikasi web yang cepat dan andal serta design system dengan pola pikir mengutamakan produk.',
    },
    cta: { en: 'See featured work', id: 'Lihat karya unggulan' },
    href: '#projects',
    bgClass: 'from-slate-900 via-slate-800 to-slate-700',
  },
  {
    id: 2,
    title: { en: 'Projects', id: 'Proyek' },
    subtitle: { en: 'Selected Work', id: 'Karya Pilihan' },
    description: {
      en: 'Case studies across web apps, dashboards, and product MVPs.',
      id: 'Studi kasus aplikasi web, dashboard, dan MVP produk.',
    },
    cta: { en: 'Browse projects', id: 'Jelajahi proyek' },
    href: '#projects',
    bgClass: 'from-emerald-950 via-teal-900 to-slate-950',
    backgroundSvg: '/assets/cards/bg-projects.svg',
  },
  {
    id: 3,
    title: { en: 'Achievements', id: 'Pencapaian' },
    subtitle: { en: 'Verified Expertise', id: 'Keahlian Terverifikasi' },
    description: {
      en: 'A collection of awards and certifications.',
      id: 'Kumpulan penghargaan dan sertifikasi.',
    },
    cta: { en: 'View achievements', id: 'Lihat pencapaian' },
    href: '#skills',
    bgClass: 'from-indigo-950 via-violet-900 to-slate-950',
    backgroundSvg: '/assets/cards/bg-skills.svg',
  },
  {
    id: 4,
    title: { en: 'Contact', id: 'Kontak' },
    subtitle: { en: 'Work With Me', id: 'Bekerja Sama' },
    description: {
      en: 'Open for freelance, full-time roles, and collaboration.',
      id: 'Terbuka untuk freelance, posisi full-time, dan kolaborasi.',
    },
    cta: { en: 'Start a conversation', id: 'Mulai percakapan' },
    href: '#contact',
    bgClass: 'from-amber-950 via-orange-900 to-rose-950',
    backgroundSvg: '/assets/cards/bg-contact.svg',
  },
]
