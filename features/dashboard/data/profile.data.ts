import type { ProfileData } from '../types'

export const getProfileData = (): ProfileData => ({
  name: 'Daffa Ardhana',
  role: 'Fullstack Engineer',
  location: 'Indonesia',
  summary:
    'Product-minded engineer focusing on scalable web apps, clean UI systems, and reliable APIs.',
  availability: 'Open for freelance, full-time, and collaboration opportunities.',
  highlights: [
    'Built and shipped multiple production web apps with Next.js and TypeScript.',
    'Designed reusable UI systems that cut development time across teams.',
    'Optimized app performance to improve page load times and Lighthouse scores.'
  ],
  skills: [
    'Next.js',
    'TypeScript',
    'React',
    'Node.js',
    'PostgreSQL',
    'Tailwind CSS'
  ],
  experience: [
    {
      role: 'Fullstack Engineer',
      company: 'Freelance & Contract',
      period: '2022 - Present',
      details: 'Delivered MVPs, dashboards, and internal tools for startups and SMBs.'
    },
    {
      role: 'Frontend Engineer',
      company: 'Product Studio',
      period: '2020 - 2022',
      details: 'Built responsive UI systems and collaborated with design teams.'
    }
  ]
})
