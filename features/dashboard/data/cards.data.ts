import type { CardItem } from '../types'

// Gambar blob di-inject dari luar (via blobUrl)
export const getCards = (blobUrl: Record<string, string> | null): CardItem[] => [
  {
    id: 1,
    image: blobUrl?.["home-card.jpeg"],
    imageAlt: "Portrait of Daffa Ardhana",
    title: "Daffa Ardhana",
    subtitle: "Fullstack Engineer",
    description: "I build fast, reliable web apps and design systems with a product-first mindset.",
    cta: "See featured work",
    href: "#projects",
    bgClass: "from-slate-900 via-slate-800 to-slate-700"
  },
  {
    id: 2,
    title: "Projects",
    subtitle: "Selected Work",
    description: "Case studies across web apps, dashboards, and product MVPs.",
    cta: "Browse projects",
    href: "#projects",
    bgClass: "from-cyan-900 via-sky-900 to-blue-800"
  },
  {
    id: 3,
    title: "Skills & Experience",
    subtitle: "What I Do",
    description: "TypeScript, Next.js, UI engineering, APIs, and performance tuning.",
    cta: "View capabilities",
    href: "#skills",
    bgClass: "from-emerald-900 via-teal-900 to-cyan-800"
  },
  {
    id: 4,
    title: "Contact",
    subtitle: "Work With Me",
    description: "Open for freelance, full-time roles, and collaboration.",
    cta: "Start a conversation",
    href: "#contact",
    bgClass: "from-orange-900 via-rose-900 to-red-800"
  }
]