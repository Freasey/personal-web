import Link from 'next/link'
import { LogoutButton } from './LogoutButton'

export const metadata = {
  title: 'Dashboard',
}

const stats = [
  { label: 'Projects', value: '12', hint: 'Active case studies' },
  { label: 'Skills tracked', value: '24', hint: 'Across stacks & tools' },
  { label: 'Contacts', value: '5', hint: 'Channels open' },
  { label: 'Uptime', value: '99.9%', hint: 'Last 30 days' },
]

const activity = [
  { title: 'Updated portfolio cards', time: 'Today', detail: 'Refined CTAs and copy on home view.' },
  { title: 'Deployed personal site', time: 'Yesterday', detail: 'Shipped to production via Vercel.' },
  { title: 'Added new project entry', time: '2 days ago', detail: 'Synced from Neon to dashboard.' },
]

export default function DashboardPage() {
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
            Welcome back
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
            Everything is in good shape.
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            A quiet workspace to monitor your portfolio, content, and recent activity.
            Modern, fast, and just for you.
          </p>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Content management
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">
                Manage projects
              </h3>
              <p className="mt-1 text-sm text-white/60">
                Create, edit, or delete projects shown on the public portfolio.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/dashboard/projects"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                Open project list
              </Link>
              <Link
                href="/dashboard/projects/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90"
              >
                + New project
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl sm:p-5"
            >
              <p className="text-xs uppercase tracking-wider text-white/40">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-white/40">{stat.hint}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide text-white/80">
                Recent activity
              </h3>
              <span className="text-xs text-white/40">Last 7 days</span>
            </div>
            <ul className="mt-4 space-y-3">
              {activity.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/15 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-white/40">{item.time}</p>
                  </div>
                  <p className="mt-1 text-xs text-white/50">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h3 className="text-sm font-semibold tracking-wide text-white/80">
              Quick links
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <span>Public portfolio</span>
                  <span className="text-white/40">↗</span>
                </a>
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
