import Link from 'next/link'
import { loadDashboardData } from '@/features/dashboard/data/neon.data'

export const metadata = {
  title: 'Projects · Dashboard',
}

export const dynamic = 'force-dynamic'

export default async function ProjectsListPage() {
  const data = await loadDashboardData(null)
  const projects = data.projects

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-[24rem] w-[24rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-xs uppercase tracking-[0.18em] text-white/40 hover:text-white/70"
            >
              ← Back to dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Projects
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Create, edit and remove projects shown on the public portfolio.
            </p>
          </div>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90"
          >
            + New project
          </Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 && (
            <p className="text-sm text-white/50">No projects yet. Create your first one.</p>
          )}
          {projects.map((project) => (
            <article
              key={project.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
            >
              <div className="relative h-40">
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      project.bgClass ?? 'from-slate-900 via-slate-800 to-slate-700'
                    }`}
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <p className="text-sm font-semibold">{project.name}</p>
                  <p className="mt-1 text-xs text-white/60">{project.summary}</p>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/40">
                  {project.year && <span>{project.year}</span>}
                  {project.role && <span>{project.role}</span>}
                  <span>{project.stack.length} stack</span>
                  <span>{project.gallery.length} images</span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <Link
                    href={`/dashboard/projects/${project.id}/edit`}
                    className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
