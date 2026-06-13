import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadDashboardData } from '@/features/dashboard/data/neon.data'
import { pickLocale, toBilingual } from '@/features/dashboard/i18n'
import { SkillForm, type SkillFormValue } from '../../_components/SkillForm'

export const metadata = {
  title: 'Edit Achievement · Dashboard',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditSkillPage({ params }: PageProps) {
  const { id } = await params
  const data = await loadDashboardData(null)
  const skill = data.skills.find((item) => item.id === id)

  if (!skill) {
    notFound()
  }

  const initialValue: SkillFormValue = {
    name: toBilingual(skill.name),
    description: toBilingual(skill.description),
    imageId: skill.imageId ?? null,
    imageUrl: skill.image ?? null,
    imageKind: skill.imageKind ?? null,
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
            href="/dashboard/skills"
            className="text-xs uppercase tracking-[0.18em] text-white/40 hover:text-white/70"
          >
            ← Back to achievements
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Edit achievement
          </h1>
          <p className="mt-1 text-sm text-white/60">{pickLocale(skill.name, 'en')}</p>
        </header>

        <SkillForm mode="edit" skillId={skill.id} initialValue={initialValue} />
      </div>
    </main>
  )
}
