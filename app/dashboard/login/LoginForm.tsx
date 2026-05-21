'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const CODE_LENGTH = 6

export const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/dashboard'

  const [digits, setDigits] = useState<string[]>(() => Array(CODE_LENGTH).fill(''))
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  const submit = async (code: string) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        setError(data?.error ?? 'Invalid code, try again.')
        setDigits(Array(CODE_LENGTH).fill(''))
        inputsRef.current[0]?.focus()
        return
      }

      router.replace(from.startsWith('/dashboard') ? from : '/dashboard')
      router.refresh()
    } catch {
      setError('Network error. Please retry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, '')
    if (!sanitized) {
      setDigits((prev) => {
        const next = [...prev]
        next[index] = ''
        return next
      })
      return
    }

    if (sanitized.length > 1) {
      const chars = sanitized.slice(0, CODE_LENGTH - index).split('')
      setDigits((prev) => {
        const next = [...prev]
        chars.forEach((char, offset) => {
          next[index + offset] = char
        })
        return next
      })
      const nextIndex = Math.min(index + chars.length, CODE_LENGTH - 1)
      inputsRef.current[nextIndex]?.focus()

      const combined = [...digits]
      chars.forEach((char, offset) => {
        combined[index + offset] = char
      })
      if (combined.every((digit) => digit !== '')) {
        submit(combined.join(''))
      }
      return
    }

    setDigits((prev) => {
      const next = [...prev]
      next[index] = sanitized
      const filled = next.every((digit) => digit !== '')
      if (filled) {
        submit(next.join(''))
      } else if (index < CODE_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus()
      }
      return next
    })
  }

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const code = digits.join('')
        if (code.length === CODE_LENGTH) {
          submit(code)
        }
      }}
      className="mt-6"
    >
      <div className="flex justify-between gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={CODE_LENGTH}
            value={digit}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            disabled={isSubmitting}
            className="h-14 w-12 rounded-xl border border-white/10 bg-white/[0.06] text-center text-2xl font-semibold tracking-tight text-white outline-none transition focus:border-white/40 focus:bg-white/[0.1] disabled:opacity-50"
          />
        ))}
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-rose-300">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || digits.some((digit) => digit === '')}
        className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Verifying…' : 'Continue'}
      </button>
    </form>
  )
}
