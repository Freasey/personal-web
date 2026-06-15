'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  id: string
  initialActive: boolean
}

// Active/inactive toggle for a project. Active projects show on the public site;
// inactive ones stay hidden but remain visible and editable in the dashboard.
export const ProjectActiveToggle = ({ id, initialActive }: Props) => {
  const router = useRouter()
  const [active, setActive] = useState(initialActive)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const toggle = async () => {
    const next = !active
    setIsLoading(true)
    setError(false)
    setActive(next) // optimistic
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: next }),
      })
      if (!res.ok) throw new Error('Request failed')
      router.refresh()
    } catch {
      setActive(!next) // revert
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isLoading}
      aria-pressed={active}
      title={error ? 'Failed to update — try again' : active ? 'Visible on the public site' : 'Hidden from the public site'}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
        active
          ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/15'
          : 'border-white/10 bg-white/[0.04] text-white/50 hover:border-white/20 hover:bg-white/[0.08]'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          error ? 'bg-rose-400' : active ? 'bg-emerald-400' : 'bg-white/30'
        }`}
      />
      {isLoading ? '…' : active ? 'Active' : 'Hidden'}
    </button>
  )
}
