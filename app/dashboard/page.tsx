import Link from 'next/link'
import { LogoutButton } from './LogoutButton'
import { getRecentVisits, getVisitStats, type VisitRow } from '@/lib/visits'

export const metadata = {
  title: 'Dashboard',
}

// Always render fresh: visitor analytics must not be cached.
export const dynamic = 'force-dynamic'

const manageLinks = [
  { href: '/dashboard/projects', title: 'Projects', description: 'Studi kasus & karya' },
  { href: '/dashboard/categories', title: 'Jenis proyek', description: 'Master kategori project' },
  { href: '/dashboard/profile', title: 'Bio', description: 'Identitas, highlights, pengalaman' },
  { href: '/dashboard/skills', title: 'Achievements', description: 'Penghargaan & keahlian' },
  { href: '/dashboard/contacts', title: 'Contacts', description: 'Channel kontak' },
]

const numberFmt = new Intl.NumberFormat('id-ID')

const formatTime = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const formatLocation = (visit: VisitRow): string => {
  const parts = [visit.city, visit.country].filter(Boolean)
  return parts.length ? parts.join(', ') : '-'
}

const deviceBadgeClass = (device: string | null): string => {
  switch (device) {
    case 'Mobile':
      return 'bg-emerald-500/15 text-emerald-300'
    case 'Tablet':
      return 'bg-amber-500/15 text-amber-300'
    case 'Bot':
      return 'bg-rose-500/15 text-rose-300'
    default:
      return 'bg-indigo-500/15 text-indigo-300'
  }
}

export default async function DashboardPage() {
  const [stats, visits] = await Promise.all([getVisitStats(), getRecentVisits(50)])

  const cards = [
    {
      label: 'Pengunjung bulan ini',
      value: numberFmt.format(stats.visitsThisMonth),
      hint: 'Total kunjungan sejak awal bulan',
    },
    {
      label: 'Pengunjung unik',
      value: numberFmt.format(stats.uniqueThisMonth),
      hint: 'Perangkat berbeda bulan ini',
    },
    {
      label: 'Pengunjung baru',
      value: numberFmt.format(stats.newThisMonth),
      hint: 'Pertama kali berkunjung bulan ini',
    },
    {
      label: 'Total kunjungan',
      value: numberFmt.format(stats.totalAllTime),
      hint: `${numberFmt.format(stats.uniqueAllTime)} unik · ${numberFmt.format(stats.visitsToday)} hari ini`,
    },
  ]

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-[24rem] w-[24rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-sm font-semibold">
              DA
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                Private workspace
              </p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Dashboard
              </h1>
            </div>
          </div>
          <LogoutButton />
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Analitik pengunjung
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
            Siapa saja yang mengakses situsmu.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Pantau IP, perangkat, dan lokasi setiap pengunjung secara real-time,
            langsung dari kunjungan yang tercatat di database.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl sm:p-5"
            >
              <p className="text-xs uppercase tracking-wider text-white/40">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-white/40">{card.hint}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Content management
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight">
            Kelola portfolio
          </h3>
          <p className="mt-1 text-sm text-white/60">
            Ubah konten yang tampil di portfolio publik secara dinamis.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {manageLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                <span className="text-sm font-semibold">{item.title}</span>
                <span className="text-xs text-white/50">{item.description}</span>
                <span className="mt-2 text-xs text-white/40 transition group-hover:text-white/70">
                  Buka →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide text-white/80">
                Kunjungan terbaru
              </h3>
              <span className="text-xs text-white/40">{visits.length} terakhir</span>
            </div>

            {visits.length === 0 ? (
              <p className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center text-sm text-white/50">
                Belum ada kunjungan tercatat.
              </p>
            ) : (
              <div className="mt-4 -mx-2 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-white/40">
                      <th className="px-2 py-2 font-medium">IP Address</th>
                      <th className="px-2 py-2 font-medium">Perangkat</th>
                      <th className="px-2 py-2 font-medium">Lokasi</th>
                      <th className="px-2 py-2 font-medium">Halaman</th>
                      <th className="px-2 py-2 font-medium">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.map((visit) => (
                      <tr
                        key={visit.id}
                        className="border-t border-white/5 transition hover:bg-white/[0.03]"
                      >
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-white/80">
                              {visit.ip_address ?? '-'}
                            </span>
                            {visit.is_new && (
                              <span className="rounded-full bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-medium text-cyan-300">
                                baru
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${deviceBadgeClass(visit.device)}`}
                            >
                              {visit.device ?? 'Unknown'}
                            </span>
                            <span className="text-xs text-white/50">
                              {[visit.browser, visit.os].filter(Boolean).join(' · ') || '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-3 text-white/70">{formatLocation(visit)}</td>
                        <td className="px-2 py-3 font-mono text-xs text-white/60">
                          {visit.path ?? '-'}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-white/60">
                          {formatTime(visit.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h3 className="text-sm font-semibold tracking-wide text-white/80">
              Quick links
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <span>Public portfolio</span>
                  <span className="text-white/40">↗</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <span>Vercel</span>
                  <span className="text-white/40">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://console.neon.tech/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <span>Neon</span>
                  <span className="text-white/40">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}
