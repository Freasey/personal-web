'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { LOCALES, UI, type Locale } from '@/features/dashboard/i18n'

export interface BilingualValue {
  en: string
  id: string
}

const emptyBilingual = (): BilingualValue => ({ en: '', id: '' })

export interface ContactFormValue {
  label: BilingualValue
  value: string
  hint: BilingualValue
}

export const emptyContactFormValue: ContactFormValue = {
  label: emptyBilingual(),
  value: '',
  hint: emptyBilingual(),
}

interface ContactFormProps {
  mode: 'create' | 'edit'
  contactId?: string
  initialValue: ContactFormValue
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10'
const labelClass = 'text-xs uppercase tracking-[0.18em] text-white/50'
const sectionClass = 'rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl'
const ghostBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50'
const primaryBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
const dangerBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50'

export const ContactForm = ({ mode, contactId, initialValue }: ContactFormProps) => {
  const router = useRouter()
  const [value, setValue] = useState<ContactFormValue>(initialValue)
  const [editLang, setEditLang] = useState<Locale>('en')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const otherLang: Locale = editLang === 'en' ? 'id' : 'en'

  const updateBilingual = (key: 'label' | 'hint', lang: Locale, next: string) =>
    setValue((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: next } }))

  const handleAutoTranslate = async () => {
    const from = editLang
    const to = otherLang
    const snapshot = value
    const texts = [snapshot.label[from], snapshot.hint[from]]

    if (!texts.some((t) => t.trim())) {
      setError(`Belum ada teks ${from.toUpperCase()} untuk diterjemahkan.`)
      return
    }

    setIsTranslating(true)
    setError(null)
    setNotice(null)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts, from, to }),
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `Terjemahan gagal (${response.status}).`)
      }
      const { translations } = (await response.json()) as { translations: string[] }

      let k = 0
      const next = (src: string, current: string) => {
        const translated = translations[k++] ?? ''
        return src.trim() ? translated : current
      }

      setValue((prev) => ({
        ...prev,
        label: { ...prev.label, [to]: next(snapshot.label[from], prev.label[to]) },
        hint: { ...prev.hint, [to]: next(snapshot.hint[from], prev.hint[to]) },
      }))
      setEditLang(to)
      setNotice(`Mengisi ${to.toUpperCase()} dari ${from.toUpperCase()}. Periksa dulu sebelum simpan.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjemahan gagal.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!value.label.en.trim() && !value.label.id.trim()) {
      setError('Label kontak wajib diisi.')
      return
    }
    if (!value.value.trim()) {
      setError('Nilai kontak (email/nomor/handle) wajib diisi.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        label: value.label,
        value: value.value.trim(),
        hint: value.hint,
      }

      const url = mode === 'create' ? '/api/contacts' : `/api/contacts/${contactId}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `Permintaan gagal (${response.status}).`)
      }

      router.push('/dashboard/contacts')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!contactId) return
    if (!window.confirm('Hapus kontak ini? Tindakan ini tidak bisa dibatalkan.')) return

    setIsDeleting(true)
    setError(null)
    try {
      const response = await fetch(`/api/contacts/${contactId}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `Permintaan gagal (${response.status}).`)
      }
      router.push('/dashboard/contacts')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error.')
      setIsDeleting(false)
    }
  }

  const busy = isSubmitting || isDeleting || isTranslating

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}
      {notice && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {notice}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className={labelClass}>Bahasa</span>
          <div className="inline-flex items-center gap-0.5 rounded-full border border-white/15 bg-black/30 p-0.5">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setEditLang(loc)}
                aria-pressed={loc === editLang}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  loc === editLang ? 'bg-white/90 text-slate-900' : 'text-white/60 hover:text-white'
                }`}
              >
                {UI[loc].languageName}
              </button>
            ))}
          </div>
        </div>
        <button type="button" onClick={handleAutoTranslate} className={ghostBtn} disabled={busy}>
          {isTranslating ? 'Menerjemahkan…' : `Auto-translate ${editLang.toUpperCase()} → ${otherLang.toUpperCase()}`}
        </button>
      </div>

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold tracking-wide text-white/80">Detail kontak</h3>
        <div className="mt-4 grid gap-4">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Label ({editLang.toUpperCase()}) *</span>
            <input
              className={inputClass}
              value={value.label[editLang]}
              onChange={(e) => updateBilingual('label', editLang, e.target.value)}
              placeholder="Email"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Nilai (email / nomor / handle) *</span>
            <input
              className={inputClass}
              value={value.value}
              onChange={(e) => setValue((prev) => ({ ...prev, value: e.target.value }))}
              placeholder="daffa.ardhana@email.com"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Hint ({editLang.toUpperCase()})</span>
            <input
              className={inputClass}
              value={value.hint[editLang]}
              onChange={(e) => updateBilingual('hint', editLang, e.target.value)}
              placeholder="Paling cocok untuk brief proyek."
            />
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/contacts')}
            className={ghostBtn}
            disabled={busy}
          >
            Batal
          </button>
          {mode === 'edit' && (
            <button type="button" onClick={handleDelete} className={dangerBtn} disabled={busy}>
              {isDeleting ? 'Menghapus…' : 'Hapus'}
            </button>
          )}
        </div>
        <button type="submit" className={primaryBtn} disabled={busy}>
          {isSubmitting
            ? mode === 'create'
              ? 'Membuat…'
              : 'Menyimpan…'
            : mode === 'create'
              ? 'Tambah kontak'
              : 'Simpan perubahan'}
        </button>
      </div>
    </form>
  )
}
