import type { ContactItem } from '../types'

export const getContactItems = (): ContactItem[] => [
  {
    id: 'contact-email',
    label: 'Email',
    value: 'daffa.ardhana@email.com',
    hint: 'Best for project briefs or collaboration requests.'
  },
  {
    id: 'contact-phone',
    label: 'Phone',
    value: '+62 812-0000-0000',
    hint: 'Quick calls for availability and timelines.'
  },
  {
    id: 'contact-instagram',
    label: 'Instagram',
    value: '@daffa.ardhana',
    hint: 'Behind-the-scenes and design explorations.'
  },
  {
    id: 'contact-linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/daffa-ardhana',
    hint: 'Connect for professional opportunities.'
  },
  {
    id: 'contact-github',
    label: 'GitHub',
    value: 'github.com/daffa-ardhana',
    hint: 'Browse code samples and open-source work.'
  }
]
