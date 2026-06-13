import type { RawContactItem } from '../types'

export const getContactItems = (): RawContactItem[] => [
  {
    id: 'contact-email',
    label: { en: 'Email', id: 'Email' },
    value: 'daffa.ardhana@email.com',
    hint: {
      en: 'Best for project briefs or collaboration requests.',
      id: 'Paling cocok untuk brief proyek atau ajakan kolaborasi.',
    },
  },
  {
    id: 'contact-phone',
    label: { en: 'Phone', id: 'Telepon' },
    value: '+62 812-0000-0000',
    hint: {
      en: 'Quick calls for availability and timelines.',
      id: 'Telepon singkat untuk ketersediaan dan timeline.',
    },
  },
  {
    id: 'contact-instagram',
    label: { en: 'Instagram', id: 'Instagram' },
    value: '@daffa.ardhana',
    hint: {
      en: 'Behind-the-scenes and design explorations.',
      id: 'Cerita di balik layar dan eksplorasi desain.',
    },
  },
  {
    id: 'contact-linkedin',
    label: { en: 'LinkedIn', id: 'LinkedIn' },
    value: 'linkedin.com/in/daffa-ardhana',
    hint: {
      en: 'Connect for professional opportunities.',
      id: 'Terhubung untuk peluang profesional.',
    },
  },
  {
    id: 'contact-github',
    label: { en: 'GitHub', id: 'GitHub' },
    value: 'github.com/daffa-ardhana',
    hint: {
      en: 'Browse code samples and open-source work.',
      id: 'Jelajahi contoh kode dan karya open-source.',
    },
  },
]
