import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadDashboardData } from '@/features/dashboard/data/neon.data'
import { pickLocale, toBilingual } from '@/features/dashboard/i18n'
import { CategoryForm, type CategoryFormValue } from '../../_components/CategoryForm'

export const metadata = {
  title: 'Edit Project Type · Dashboard',
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params
  const data = await loadDashboardData(null)
  const category = data.categories.find((item) => item.id === id)

  if (!category) {
    notFound()
  }

  const initialValue: CategoryFormValue = {
    name: toBilingual(category.name),
    description: toBilingual(category.description),
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
            href="/dashboard/categories"
            className="text-xs uppercase tracking-[0.18em] text-white/40 hover:text-white/70"
          >
            ← Back to project types
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Edit project type</h1>
          <p className="mt-1 text-sm text-white/60">{pickLocale(category.name, 'en')}</p>
        </header>

        <CategoryForm mode="edit" categoryId={category.id} initialValue={initialValue} />
      </div>
    </main>
  )
}
