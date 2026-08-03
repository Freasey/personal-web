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
      title={error ? 'Failed to update, try again' : active ? 'Visible on the public site' : 'Hidden from the public site'}
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur-md transition disabled:opacity-50 ${
        active
          ? 'border-emerald-400/40 bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30'
          : 'border-white/15 bg-black/40 text-white/70 hover:border-white/30 hover:bg-black/55'
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
