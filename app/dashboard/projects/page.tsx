import Link from 'next/link'
import { listProjectsForDashboard } from '@/features/dashboard/data/projects.write'
import { pickLocale } from '@/features/dashboard/i18n'
import { ProjectActiveToggle } from './_components/ProjectActiveToggle'

export const metadata = {
  title: 'Projects · Dashboard',
}

export const dynamic = 'force-dynamic'

export default async function ProjectsListPage() {
  const projects = await listProjectsForDashboard()

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
              className={`flex flex-col overflow-hidden rounded-3xl border bg-white/[0.03] backdrop-blur-xl transition ${
                project.isActive ? 'border-white/10' : 'border-white/5 opacity-60'
              }`}
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
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
                )}
                <div className="absolute right-3 top-3 z-10">
                  <ProjectActiveToggle id={project.id} initialActive={project.isActive} />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <p className="text-sm font-semibold">{project.name}</p>
                  <p className="mt-1 text-xs text-white/60">{pickLocale(project.summary, 'en')}</p>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/40">
                  {project.year && <span>{project.year}</span>}
                  {pickLocale(project.role, 'en') && <span>{pickLocale(project.role, 'en')}</span>}
                  <span>{project.stackCount} stack</span>
                  <span>{project.galleryCount} images</span>
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
