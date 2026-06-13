import type { RawProjectItem } from '../types'

export const getProjectsData = (blobUrl: Record<string, string> | null): RawProjectItem[] => [
  {
    id: 'proj-1',
    name: 'Productivity Dashboard',
    summary: {
      en: 'Analytics dashboard for team performance and OKR tracking.',
      id: 'Dashboard analitik untuk performa tim dan pelacakan OKR.',
    },
    description: {
      en: 'Built a real-time dashboard with role-based access, interactive charts, and exportable reports for product teams.',
      id: 'Membangun dashboard real-time dengan akses berbasis peran, grafik interaktif, dan laporan yang dapat diekspor untuk tim produk.',
    },
    image: blobUrl?.['project-dashboard.jpeg'],
    bgClass: 'from-indigo-900 via-slate-900 to-slate-800',
    gallery: [
      {
        id: 'proj-1-hero',
        image: blobUrl?.['project-dashboard-hero.jpeg'],
        alt: { en: 'Dashboard overview screen', id: 'Layar ringkasan dashboard' },
        caption: {
          en: 'Overview analytics and KPI widgets.',
          id: 'Ringkasan analitik dan widget KPI.',
        },
        bgClass: 'from-indigo-900 via-slate-900 to-slate-800',
      },
      {
        id: 'proj-1-table',
        image: blobUrl?.['project-dashboard-table.jpeg'],
        alt: { en: 'Report table view', id: 'Tampilan tabel laporan' },
        caption: {
          en: 'Exportable reports and filters.',
          id: 'Laporan yang dapat diekspor dan filter.',
        },
        bgClass: 'from-slate-900 via-slate-800 to-slate-700',
      },
      {
        id: 'proj-1-chart',
        image: blobUrl?.['project-dashboard-chart.jpeg'],
        alt: { en: 'Interactive chart', id: 'Grafik interaktif' },
        caption: {
          en: 'Custom chart components with drill-down.',
          id: 'Komponen grafik kustom dengan drill-down.',
        },
        bgClass: 'from-indigo-950 via-slate-900 to-slate-800',
      },
    ],
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    highlights: [
      {
        en: 'Role-based analytics with custom filters and saved views.',
        id: 'Analitik berbasis peran dengan filter kustom dan tampilan tersimpan.',
      },
      {
        en: 'Live update widgets with WebSocket-driven data.',
        id: 'Widget pembaruan langsung dengan data berbasis WebSocket.',
      },
      {
        en: 'CSV and PDF exports for reporting workflows.',
        id: 'Ekspor CSV dan PDF untuk alur kerja pelaporan.',
      },
    ],
    responsibilities: [
      {
        en: 'Owned frontend architecture and data visualization layer.',
        id: 'Bertanggung jawab atas arsitektur frontend dan lapisan visualisasi data.',
      },
      {
        en: 'Built reusable chart components and table utilities.',
        id: 'Membangun komponen grafik dan utilitas tabel yang dapat dipakai ulang.',
      },
      {
        en: 'Partnered with backend for API design and caching strategy.',
        id: 'Berkolaborasi dengan tim backend untuk desain API dan strategi caching.',
      },
    ],
    year: '2024',
    role: { en: 'Fullstack Engineer', id: 'Fullstack Engineer' },
  },
  {
    id: 'proj-2',
    name: 'E-commerce MVP',
    summary: {
      en: 'Fast launch storefront with headless CMS integration.',
      id: 'Storefront peluncuran cepat dengan integrasi headless CMS.',
    },
    description: {
      en: 'Implemented a performant storefront with product search, cart, and payment workflow for a new brand launch.',
      id: 'Mengimplementasikan storefront berperforma tinggi dengan pencarian produk, keranjang, dan alur pembayaran untuk peluncuran brand baru.',
    },
    image: blobUrl?.['project-commerce.jpeg'],
    bgClass: 'from-emerald-900 via-teal-900 to-slate-800',
    gallery: [
      {
        id: 'proj-2-home',
        image: blobUrl?.['project-commerce-home.jpeg'],
        alt: { en: 'Commerce homepage', id: 'Beranda toko' },
        caption: {
          en: 'Hero campaign and featured products.',
          id: 'Kampanye hero dan produk unggulan.',
        },
        bgClass: 'from-emerald-900 via-teal-900 to-slate-800',
      },
      {
        id: 'proj-2-product',
        image: blobUrl?.['project-commerce-product.jpeg'],
        alt: { en: 'Product detail page', id: 'Halaman detail produk' },
        caption: {
          en: 'Product detail with variants and reviews.',
          id: 'Detail produk dengan varian dan ulasan.',
        },
        bgClass: 'from-teal-950 via-slate-900 to-slate-800',
      },
      {
        id: 'proj-2-checkout',
        image: blobUrl?.['project-commerce-checkout.jpeg'],
        alt: { en: 'Checkout flow', id: 'Alur checkout' },
        caption: {
          en: 'Fast checkout flow with Stripe.',
          id: 'Alur checkout cepat dengan Stripe.',
        },
        bgClass: 'from-emerald-950 via-slate-900 to-slate-800',
      },
    ],
    stack: ['Next.js', 'Stripe', 'Sanity'],
    highlights: [
      {
        en: 'Faceted search with instant filtering and pagination.',
        id: 'Pencarian terfaset dengan filter instan dan paginasi.',
      },
      {
        en: 'Integrated Stripe Checkout for secure payments.',
        id: 'Mengintegrasikan Stripe Checkout untuk pembayaran yang aman.',
      },
      {
        en: 'CMS-driven marketing pages and promotions.',
        id: 'Halaman pemasaran dan promosi berbasis CMS.',
      },
    ],
    responsibilities: [
      {
        en: 'Led UI implementation and page performance tuning.',
        id: 'Memimpin implementasi UI dan optimasi performa halaman.',
      },
      {
        en: 'Built reusable cart and checkout components.',
        id: 'Membangun komponen keranjang dan checkout yang dapat dipakai ulang.',
      },
      {
        en: 'Coordinated CMS content model with stakeholders.',
        id: 'Mengoordinasikan model konten CMS dengan pemangku kepentingan.',
      },
    ],
    year: '2023',
    role: { en: 'Frontend Engineer', id: 'Frontend Engineer' },
  },
  {
    id: 'proj-3',
    name: 'Design System',
    summary: {
      en: 'Reusable UI library for multi-product teams.',
      id: 'Pustaka UI yang dapat dipakai ulang untuk tim multi-produk.',
    },
    description: {
      en: 'Created a scalable component library with tokens, docs, and accessibility standards for consistent delivery.',
      id: 'Membuat pustaka komponen yang skalabel dengan token, dokumentasi, dan standar aksesibilitas untuk pengiriman yang konsisten.',
    },
    image: blobUrl?.['project-design-system.jpeg'],
    bgClass: 'from-sky-900 via-cyan-900 to-slate-800',
    gallery: [
      {
        id: 'proj-3-library',
        image: blobUrl?.['project-design-system-library.jpeg'],
        alt: { en: 'Component library', id: 'Pustaka komponen' },
        caption: {
          en: 'Reusable UI components and tokens.',
          id: 'Komponen UI dan token yang dapat dipakai ulang.',
        },
        bgClass: 'from-sky-900 via-cyan-900 to-slate-800',
      },
      {
        id: 'proj-3-docs',
        image: blobUrl?.['project-design-system-docs.jpeg'],
        alt: { en: 'Storybook docs', id: 'Dokumentasi Storybook' },
        caption: {
          en: 'Storybook documentation and guidelines.',
          id: 'Dokumentasi dan panduan Storybook.',
        },
        bgClass: 'from-cyan-950 via-slate-900 to-slate-800',
      },
      {
        id: 'proj-3-tokens',
        image: blobUrl?.['project-design-system-tokens.jpeg'],
        alt: { en: 'Design tokens', id: 'Design token' },
        caption: {
          en: 'Design tokens for theme consistency.',
          id: 'Design token untuk konsistensi tema.',
        },
        bgClass: 'from-sky-950 via-slate-900 to-slate-800',
      },
    ],
    stack: ['React', 'Storybook', 'Tailwind CSS'],
    highlights: [
      {
        en: 'Token-based theming and responsive layout utilities.',
        id: 'Tema berbasis token dan utilitas tata letak responsif.',
      },
      {
        en: 'Storybook documentation with usage guidelines.',
        id: 'Dokumentasi Storybook dengan panduan penggunaan.',
      },
      {
        en: 'Accessibility review for core components.',
        id: 'Tinjauan aksesibilitas untuk komponen inti.',
      },
    ],
    responsibilities: [
      {
        en: 'Designed component APIs and usage patterns.',
        id: 'Merancang API komponen dan pola penggunaan.',
      },
      {
        en: 'Set up Storybook and documentation workflows.',
        id: 'Menyiapkan Storybook dan alur kerja dokumentasi.',
      },
      {
        en: 'Delivered migration guide for legacy UI.',
        id: 'Menyediakan panduan migrasi untuk UI lama.',
      },
    ],
    year: '2022',
    role: { en: 'UI Engineer', id: 'UI Engineer' },
  },
]
