import type { RawProfileData } from '../types'

export const getProfileData = (): RawProfileData => ({
  name: 'Daffa Ardhana',
  role: { en: 'Fullstack Engineer', id: 'Fullstack Engineer' },
  location: { en: 'Indonesia', id: 'Indonesia' },
  summary: {
    en: 'Product-minded engineer focusing on scalable web apps, clean UI systems, and reliable APIs.',
    id: 'Engineer berorientasi produk yang fokus pada aplikasi web skalabel, sistem UI yang rapi, dan API yang andal.',
  },
  availability: {
    en: 'Open for freelance, full-time, and collaboration opportunities.',
    id: 'Terbuka untuk peluang freelance, full-time, dan kolaborasi.',
  },
  highlights: [
    {
      en: 'Built and shipped multiple production web apps with Next.js and TypeScript.',
      id: 'Membangun dan merilis beberapa aplikasi web produksi dengan Next.js dan TypeScript.',
    },
    {
      en: 'Designed reusable UI systems that cut development time across teams.',
      id: 'Merancang sistem UI yang dapat dipakai ulang sehingga memangkas waktu pengembangan antar tim.',
    },
    {
      en: 'Optimized app performance to improve page load times and Lighthouse scores.',
      id: 'Mengoptimalkan performa aplikasi untuk mempercepat waktu muat halaman dan skor Lighthouse.',
    },
  ],
  skills: ['Next.js', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
  experience: [
    {
      role: { en: 'Fullstack Engineer', id: 'Fullstack Engineer' },
      company: 'Freelance & Contract',
      period: '2022 - Present',
      details: {
        en: 'Delivered MVPs, dashboards, and internal tools for startups and SMBs.',
        id: 'Mengerjakan MVP, dashboard, dan tool internal untuk startup dan UKM.',
      },
    },
    {
      role: { en: 'Frontend Engineer', id: 'Frontend Engineer' },
      company: 'Product Studio',
      period: '2020 - 2022',
      details: {
        en: 'Built responsive UI systems and collaborated with design teams.',
        id: 'Membangun sistem UI responsif dan berkolaborasi dengan tim desain.',
      },
    },
  ],
})
