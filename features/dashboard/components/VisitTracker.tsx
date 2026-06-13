'use client'

import { useEffect } from 'react'

// Module-level guard: one log per full page load. Survives React StrictMode's
// double-invoked effects (dev), resets naturally on a real reload/navigation.
let logged = false

/**
 * Fire-and-forget visit beacon for the public site. Renders nothing; posts the
 * current path + referrer to /api/track, which records IP, device, and geo.
 */
export function VisitTracker() {
  useEffect(() => {
    if (logged) return
    logged = true

    const payload = JSON.stringify({
      path: window.location.pathname,
      referrer: document.referrer || null,
    })

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // analytics must never surface errors to the visitor
      logged = false
    })
  }, [])

  return null
}
