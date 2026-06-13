'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { LOCALES, UI, type Locale } from '@/features/dashboard/i18n'

export interface BilingualValue {
  en: string
  id: string
}

const emptyBilingual = (): BilingualValue => ({ en: '', id: '' })

export interface ExperienceValue {
  role: BilingualValue
  company: string
  period: string
  details: BilingualValue
}

const emptyExperience = (): ExperienceValue => ({
  role: emptyBilingual(),
  company: '',
  period: '',
  details: emptyBilingual(),
})

export interface ProfileFormValue {
  name: string
  role: BilingualValue
  location: BilingualValue
  summary: BilingualValue
  availability: BilingualValue
  highlights: BilingualValue[]
  skills: string[]
  experience: ExperienceValue[]
}

export const emptyProfileFormValue: ProfileFormValue = {
  name: '',
  role: emptyBilingual(),
  location: emptyBilingual(),
  summary: emptyBilingual(),
  availability: emptyBilingual(),
  highlights: [],
  skills: [],
  experience: [],
}

interface ProfileFormProps {
  initialValue: ProfileFormValue
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10'
const labelClass = 'text-xs uppercase tracking-[0.18em] text-white/50'
const sectionClass = 'rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl'
const ghostBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50'
const primaryBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
const removeBtn =
  'shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 transition hover:border-rose-500/30 hover:text-rose-200'

type BilingualKey = 'role' | 'location' | 'summary' | 'availability'

const hasBilingualContent = (v: BilingualValue) => Boolean(v.en.trim() || v.id.trim())

export const ProfileForm = ({ initialValue }: ProfileFormProps) => {
  const router = useRouter()
  const [value, setValue] = useState<ProfileFormValue>(initialValue)
  const [editLang, setEditLang] = useState<Locale>('en')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const otherLang: Locale = editLang === 'en' ? 'id' : 'en'

  const updateBilingual = (key: BilingualKey, lang: Locale, next: string) =>
    setValue((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: next } }))

  // Highlights (bilingual list)
  const updateHighlight = (index: number, lang: Locale, next: string) =>
    setValue((prev) => ({
      ...prev,
      highlights: prev.highlights.map((item, i) =>
        i === index ? { ...item, [lang]: next } : item,
      ),
    }))
  const addHighlight = () =>
    setValue((prev) => ({ ...prev, highlights: [...prev.highlights, emptyBilingual()] }))
  const removeHighlight = (index: number) =>
    setValue((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }))

  // Core skills (plain list)
  const updateSkill = (index: number, next: string) =>
    setValue((prev) => {
      const skills = [...prev.skills]
      skills[index] = next
      return { ...prev, skills }
    })
  const addSkill = () => setValue((prev) => ({ ...prev, skills: [...prev.skills, ''] }))
  const removeSkill = (index: number) =>
    setValue((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))

  // Experience (list of records)
  const updateExperience = (index: number, patch: Partial<ExperienceValue>) =>
    setValue((prev) => {
      const experience = [...prev.experience]
      experience[index] = { ...experience[index], ...patch }
      return { ...prev, experience }
    })
  const updateExperienceBilingual = (
    index: number,
    key: 'role' | 'details',
    lang: Locale,
    next: string,
  ) =>
    setValue((prev) => {
      const experience = prev.experience.map((item, i) =>
        i === index ? { ...item, [key]: { ...item[key], [lang]: next } } : item,
      )
      return { ...prev, experience }
    })
  const addExperience = () =>
    setValue((prev) => ({ ...prev, experience: [...prev.experience, emptyExperience()] }))
  const removeExperience = (index: number) =>
    setValue((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))

  const handleAutoTranslate = async () => {
    const from = editLang
    const to = otherLang
    const snapshot = value

    const texts: string[] = [
      snapshot.role[from],
      snapshot.location[from],
      snapshot.summary[from],
      snapshot.availability[from],
      ...snapshot.highlights.map((h) => h[from]),
      ...snapshot.experience.flatMap((e) => [e.role[from], e.details[from]]),
    ]

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
        role: { ...prev.role, [to]: next(snapshot.role[from], prev.role[to]) },
        location: { ...prev.location, [to]: next(snapshot.location[from], prev.location[to]) },
        summary: { ...prev.summary, [to]: next(snapshot.summary[from], prev.summary[to]) },
        availability: {
          ...prev.availability,
          [to]: next(snapshot.availability[from], prev.availability[to]),
        },
        highlights: prev.highlights.map((item, i) => ({
          ...item,
          [to]: next(snapshot.highlights[i]?.[from] ?? '', item[to]),
        })),
        experience: prev.experience.map((item, i) => ({
          ...item,
          role: { ...item.role, [to]: next(snapshot.experience[i]?.role[from] ?? '', item.role[to]) },
          details: {
            ...item.details,
            [to]: next(snapshot.experience[i]?.details[from] ?? '', item.details[to]),
          },
        })),
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

    if (!value.name.trim()) {
      setError('Nama wajib diisi.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: value.name.trim(),
        role: value.role,
        location: value.location,
        summary: value.summary,
        availability: value.availability,
        highlights: value.highlights.filter(hasBilingualContent),
        skills: value.skills.map((s) => s.trim()).filter(Boolean),
        experience: value.experience
          .map((e) => ({
            role: e.role,
            company: e.company.trim(),
            period: e.period.trim(),
            details: e.details,
          }))
          .filter(
            (e) =>
              hasBilingualContent(e.role) ||
              e.company ||
              e.period ||
              hasBilingualContent(e.details),
          ),
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `Permintaan gagal (${response.status}).`)
      }

      setNotice('Bio tersimpan.')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const busy = isSubmitting || isTranslating

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
        <h3 className="text-sm font-semibold tracking-wide text-white/80">Identitas</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className={labelClass}>Nama *</span>
            <input
              className={inputClass}
              value={value.name}
              onChange={(e) => setValue((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Daffa Ardhana"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Role ({editLang.toUpperCase()})</span>
            <input
              className={inputClass}
              value={value.role[editLang]}
              onChange={(e) => updateBilingual('role', editLang, e.target.value)}
              placeholder="Fullstack Engineer"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Lokasi ({editLang.toUpperCase()})</span>
            <input
              className={inputClass}
              value={value.location[editLang]}
              onChange={(e) => updateBilingual('location', editLang, e.target.value)}
              placeholder="Indonesia"
            />
          </label>
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className={labelClass}>Ringkasan ({editLang.toUpperCase()})</span>
            <textarea
              className={`${inputClass} min-h-[100px]`}
              value={value.summary[editLang]}
              onChange={(e) => updateBilingual('summary', editLang, e.target.value)}
              placeholder="Engineer berorientasi produk…"
            />
          </label>
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className={labelClass}>Ketersediaan ({editLang.toUpperCase()})</span>
            <input
              className={inputClass}
              value={value.availability[editLang]}
              onChange={(e) => updateBilingual('availability', editLang, e.target.value)}
              placeholder="Terbuka untuk freelance, full-time, dan kolaborasi."
            />
          </label>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-white/80">
            Highlights <span className="text-white/40">({editLang.toUpperCase()})</span>
          </h3>
          <button type="button" onClick={addHighlight} className={ghostBtn}>
            + Tambah
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {value.highlights.length === 0 && (
            <p className="text-xs text-white/40">Belum ada highlight.</p>
          )}
          {value.highlights.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <textarea
                className={`${inputClass} min-h-[60px]`}
                value={item[editLang]}
                onChange={(e) => updateHighlight(index, editLang, e.target.value)}
                placeholder="Membangun dan merilis beberapa aplikasi web produksi…"
              />
              <button type="button" onClick={() => removeHighlight(index)} className={removeBtn}>
                Hapus
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-white/80">Core skills</h3>
          <button type="button" onClick={addSkill} className={ghostBtn}>
            + Tambah
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {value.skills.length === 0 && <p className="text-xs text-white/40">Belum ada skill.</p>}
          {value.skills.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <input
                className={inputClass}
                value={item}
                onChange={(e) => updateSkill(index, e.target.value)}
                placeholder="Next.js"
              />
              <button type="button" onClick={() => removeSkill(index)} className={removeBtn}>
                Hapus
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-white/80">Pengalaman</h3>
          <button type="button" onClick={addExperience} className={ghostBtn}>
            + Tambah
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {value.experience.length === 0 && (
            <p className="text-xs text-white/40">Belum ada pengalaman.</p>
          )}
          {value.experience.map((item, index) => (
            <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Pengalaman #{index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-xs text-rose-200/80 hover:text-rose-200"
                >
                  Hapus
                </button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Role ({editLang.toUpperCase()})</span>
                  <input
                    className={inputClass}
                    value={item.role[editLang]}
                    onChange={(e) => updateExperienceBilingual(index, 'role', editLang, e.target.value)}
                    placeholder="Fullstack Engineer"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Perusahaan</span>
                  <input
                    className={inputClass}
                    value={item.company}
                    onChange={(e) => updateExperience(index, { company: e.target.value })}
                    placeholder="Freelance & Contract"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Periode</span>
                  <input
                    className={inputClass}
                    value={item.period}
                    onChange={(e) => updateExperience(index, { period: e.target.value })}
                    placeholder="2022 - Present"
                  />
                </label>
                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className={labelClass}>Detail ({editLang.toUpperCase()})</span>
                  <textarea
                    className={`${inputClass} min-h-[60px]`}
                    value={item.details[editLang]}
                    onChange={(e) => updateExperienceBilingual(index, 'details', editLang, e.target.value)}
                    placeholder="Mengerjakan MVP, dashboard, dan tool internal…"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button type="submit" className={primaryBtn} disabled={busy}>
          {isSubmitting ? 'Menyimpan…' : 'Simpan bio'}
        </button>
      </div>
    </form>
  )
}
