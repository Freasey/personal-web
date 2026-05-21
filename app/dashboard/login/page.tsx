import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export const metadata = {
  title: 'Dashboard Login',
}

export default function DashboardLoginPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-2xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-sm font-semibold">
                DA
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
                <p className="text-xs text-white/50">Authenticator required</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">
              Enter your 6-digit code
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Open your authenticator app and enter the current code to continue.
            </p>

            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-6 text-center text-xs text-white/40">
            Protected area &middot; TOTP (RFC 6238)
          </p>
        </div>
      </div>
    </main>
  )
}
