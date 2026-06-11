import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadDashboardData } from '@/features/dashboard/data/neon.data'
import {
  ProjectForm,
  type ProjectFormValue,
} from '../../_components/ProjectForm'

export const metadata = {
  title: 'Edit Project · Dashboard',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params
  const data = await loadDashboardData(null)
  const project = data.projects.find((item) => item.id === id)

  if (!project) {
    notFound()
  }

  const initialValue: ProjectFormValue = {
    name: project.name,
    summary: project.summary,
    description: project.description,
    imageId: project.imageId ?? null,
    imageUrl: project.image ?? null,
    imageKind: project.imageKind ?? null,
    bgClass: project.bgClass ?? '',
    year: project.year,
    role: project.role,
    stack: project.stack,
    highlights: project.highlights,
    responsibilities: project.responsibilities,
    gallery: project.gallery.map((item) => ({
      alt: item.alt,
      caption: item.caption,
      imageId: item.imageId ?? null,
      imageUrl: item.image ?? null,
      imageKind: item.imageKind ?? null,
      bgClass: item.bgClass ?? '',
    })),
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-[24rem] w-[24rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
        <header>
          <Link
            href="/dashboard/projects"
            className="text-xs uppercase tracking-[0.18em] text-white/40 hover:text-white/70"
          >
            ← Back to projects
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Edit project
          </h1>
          <p className="mt-1 text-sm text-white/60">{project.name}</p>
        </header>

        <ProjectForm mode="edit" projectId={project.id} initialValue={initialValue} />
      </div>
    </main>
  )
}
