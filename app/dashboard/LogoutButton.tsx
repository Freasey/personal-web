'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const LogoutButton = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.replace('/dashboard/login')
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] disabled:opacity-50"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {isLoading ? 'Signing out…' : 'Sign out'}
    </button>
  )
}
