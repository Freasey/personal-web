import Link from 'next/link'
import { loadDashboardData } from '@/features/dashboard/data/neon.data'
import { pickLocale } from '@/features/dashboard/i18n'

export const metadata = {
  title: 'Contacts · Dashboard',
}

export const dynamic = 'force-dynamic'

export default async function ContactsListPage() {
  const data = await loadDashboardData(null)
  const contacts = data.contacts

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
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Contacts</h1>
            <p className="mt-1 text-sm text-white/60">
              Channel kontak yang tampil di halaman Contact portfolio publik.
            </p>
          </div>
          <Link
            href="/dashboard/contacts/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90"
          >
            + New contact
          </Link>
        </header>

        <section className="flex flex-col gap-3">
          {contacts.length === 0 && (
            <p className="text-sm text-white/50">Belum ada kontak. Buat yang pertama.</p>
          )}
          {contacts.map((contact) => (
            <article
              key={contact.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                  {pickLocale(contact.label, 'en')}
                </p>
                <p className="mt-1 truncate text-sm font-semibold">{contact.value}</p>
                <p className="mt-1 truncate text-xs text-white/50">
                  {pickLocale(contact.hint, 'en')}
                </p>
              </div>
              <Link
                href={`/dashboard/contacts/${contact.id}/edit`}
                className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                Edit
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
