import Link from 'next/link'
import { ContactForm, emptyContactFormValue } from '../_components/ContactForm'

export const metadata = {
  title: 'New Contact · Dashboard',
}

export default function NewContactPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-[24rem] w-[24rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
        <header>
          <Link
            href="/dashboard/contacts"
            className="text-xs uppercase tracking-[0.18em] text-white/40 hover:text-white/70"
          >
            ← Back to contacts
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">New contact</h1>
          <p className="mt-1 text-sm text-white/60">
            Tambah channel kontak baru ke halaman Contact publik.
          </p>
        </header>

        <ContactForm mode="create" initialValue={emptyContactFormValue} />
      </div>
    </main>
  )
}
