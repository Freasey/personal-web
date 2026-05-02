import type { ProjectItem } from '../types'

export const getProjectsData = (blobUrl: Record<string, string> | null): ProjectItem[] => [
  {
    id: 'proj-1',
    name: 'Productivity Dashboard',
    summary: 'Analytics dashboard for team performance and OKR tracking.',
    description:
      'Built a real-time dashboard with role-based access, interactive charts, and exportable reports for product teams.',
    image: blobUrl?.['project-dashboard.jpeg'],
    bgClass: 'from-indigo-900 via-slate-900 to-slate-800',
    gallery: [
      {
        id: 'proj-1-hero',
        image: blobUrl?.['project-dashboard-hero.jpeg'],
        alt: 'Dashboard overview screen',
        caption: 'Overview analytics and KPI widgets.',
        bgClass: 'from-indigo-900 via-slate-900 to-slate-800'
      },
      {
        id: 'proj-1-table',
        image: blobUrl?.['project-dashboard-table.jpeg'],
        alt: 'Report table view',
        caption: 'Exportable reports and filters.',
        bgClass: 'from-slate-900 via-slate-800 to-slate-700'
      },
      {
        id: 'proj-1-chart',
        image: blobUrl?.['project-dashboard-chart.jpeg'],
        alt: 'Interactive chart',
        caption: 'Custom chart components with drill-down.',
        bgClass: 'from-indigo-950 via-slate-900 to-slate-800'
      }
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    highlights: [
      'Role-based analytics with custom filters and saved views.',
      'Live update widgets with WebSocket-driven data.',
      'CSV and PDF exports for reporting workflows.'
    ],
    responsibilities: [
      'Owned frontend architecture and data visualization layer.',
      'Built reusable chart components and table utilities.',
      'Partnered with backend for API design and caching strategy.'
    ],
    year: '2024',
    role: 'Fullstack Engineer'
  },
  {
    id: 'proj-2',
    name: 'E-commerce MVP',
    summary: 'Fast launch storefront with headless CMS integration.',
    description:
      'Implemented a performant storefront with product search, cart, and payment workflow for a new brand launch.',
    image: blobUrl?.['project-commerce.jpeg'],
    bgClass: 'from-emerald-900 via-teal-900 to-slate-800',
    gallery: [
      {
        id: 'proj-2-home',
        image: blobUrl?.['project-commerce-home.jpeg'],
        alt: 'Commerce homepage',
        caption: 'Hero campaign and featured products.',
        bgClass: 'from-emerald-900 via-teal-900 to-slate-800'
      },
      {
        id: 'proj-2-product',
        image: blobUrl?.['project-commerce-product.jpeg'],
        alt: 'Product detail page',
        caption: 'Product detail with variants and reviews.',
        bgClass: 'from-teal-950 via-slate-900 to-slate-800'
      },
      {
        id: 'proj-2-checkout',
        image: blobUrl?.['project-commerce-checkout.jpeg'],
        alt: 'Checkout flow',
        caption: 'Fast checkout flow with Stripe.',
        bgClass: 'from-emerald-950 via-slate-900 to-slate-800'
      }
    ],
    stack: ['Next.js', 'Stripe', 'Sanity'],
    highlights: [
      'Faceted search with instant filtering and pagination.',
      'Integrated Stripe Checkout for secure payments.',
      'CMS-driven marketing pages and promotions.'
    ],
    responsibilities: [
      'Led UI implementation and page performance tuning.',
      'Built reusable cart and checkout components.',
      'Coordinated CMS content model with stakeholders.'
    ],
    year: '2023',
    role: 'Frontend Engineer'
  },
  {
    id: 'proj-3',
    name: 'Design System',
    summary: 'Reusable UI library for multi-product teams.',
    description:
      'Created a scalable component library with tokens, docs, and accessibility standards for consistent delivery.',
    image: blobUrl?.['project-design-system.jpeg'],
    bgClass: 'from-sky-900 via-cyan-900 to-slate-800',
    gallery: [
      {
        id: 'proj-3-library',
        image: blobUrl?.['project-design-system-library.jpeg'],
        alt: 'Component library',
        caption: 'Reusable UI components and tokens.',
        bgClass: 'from-sky-900 via-cyan-900 to-slate-800'
      },
      {
        id: 'proj-3-docs',
        image: blobUrl?.['project-design-system-docs.jpeg'],
        alt: 'Storybook docs',
        caption: 'Storybook documentation and guidelines.',
        bgClass: 'from-cyan-950 via-slate-900 to-slate-800'
      },
      {
        id: 'proj-3-tokens',
        image: blobUrl?.['project-design-system-tokens.jpeg'],
        alt: 'Design tokens',
        caption: 'Design tokens for theme consistency.',
        bgClass: 'from-sky-950 via-slate-900 to-slate-800'
      }
    ],
    stack: ['React', 'Storybook', 'Tailwind CSS'],
    highlights: [
      'Token-based theming and responsive layout utilities.',
      'Storybook documentation with usage guidelines.',
      'Accessibility review for core components.'
    ],
    responsibilities: [
      'Designed component APIs and usage patterns.',
      'Set up Storybook and documentation workflows.',
      'Delivered migration guide for legacy UI.'
    ],
    year: '2022',
    role: 'UI Engineer'
  }
]
