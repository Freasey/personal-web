import Link from 'next/link'
import { loadDashboardData } from '@/features/dashboard/data/neon.data'
import { toBilingual } from '@/features/dashboard/i18n'
import { ProfileForm, type ProfileFormValue } from './_components/ProfileForm'

export const metadata = {
  title: 'Bio · Dashboard',
}

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const data = await loadDashboardData(null)
  const profile = data.profile

  const initialValue: ProfileFormValue = {
    name: profile.name,
    role: toBilingual(profile.role),
    location: toBilingual(profile.location),
    summary: toBilingual(profile.summary),
    availability: toBilingual(profile.availability),
    highlights: profile.highlights.map((item) => toBilingual(item)),
    skills: profile.skills,
    experience: profile.experience.map((item) => ({
      role: toBilingual(item.role),
      company: item.company,
      period: item.period,
      details: toBilingual(item.details),
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
            href="/dashboard"
            className="text-xs uppercase tracking-[0.18em] text-white/40 hover:text-white/70"
          >
            ← Back to dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Bio</h1>
          <p className="mt-1 text-sm text-white/60">
            Ubah identitas, ringkasan, highlights, core skills, dan pengalaman yang tampil di portfolio publik.
          </p>
        </header>

        <ProfileForm initialValue={initialValue} />
      </div>
    </main>
  )
}
