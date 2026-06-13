'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { MediaPicker, type MediaKind, type MediaPickerValue } from './MediaPicker'
import { LOCALES, UI, type Locale } from '@/features/dashboard/i18n'

/** A value held in both languages while editing. */
export interface BilingualValue {
  en: string
  id: string
}

const emptyBilingual = (): BilingualValue => ({ en: '', id: '' })

export interface ProjectFormGalleryValue {
  caption: BilingualValue
  imageId: string | null
  imageUrl: string | null
  imageKind: MediaKind | null
  bgClass: string
}

export interface ProjectFormValue {
  name: string
  summary: BilingualValue
  description: BilingualValue
  imageId: string | null
  imageUrl: string | null
  imageKind: MediaKind | null
  bgClass: string
  year: string
  role: BilingualValue
  stack: string[]
  highlights: BilingualValue[]
  responsibilities: BilingualValue[]
  gallery: ProjectFormGalleryValue[]
}

export const emptyProjectFormValue: ProjectFormValue = {
  name: '',
  summary: emptyBilingual(),
  description: emptyBilingual(),
  imageId: null,
  imageUrl: null,
  imageKind: null,
  bgClass: '',
  year: '',
  role: emptyBilingual(),
  stack: [],
  highlights: [],
  responsibilities: [],
  gallery: [],
}

interface ProjectFormProps {
  mode: 'create' | 'edit'
  projectId?: string
  initialValue: ProjectFormValue
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/30 transition focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10'

const labelClass = 'text-xs uppercase tracking-[0.18em] text-white/50'

const sectionClass =
  'rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl'

const ghostBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50'

const primaryBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'

const dangerBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50'

type BilingualKey = 'summary' | 'description' | 'role'
type ListKey = 'highlights' | 'responsibilities'

const hasBilingualContent = (value: BilingualValue) =>
  Boolean(value.en.trim() || value.id.trim())

export const ProjectForm = ({ mode, projectId, initialValue }: ProjectFormProps) => {
  const router = useRouter()
  const [value, setValue] = useState<ProjectFormValue>(initialValue)
  const [editLang, setEditLang] = useState<Locale>('en')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const otherLang: Locale = editLang === 'en' ? 'id' : 'en'

  const updateBilingual = (key: BilingualKey, lang: Locale, next: string) =>
    setValue((prev) => ({ ...prev, [key]: { ...prev[key], [lang]: next } }))

  const updateListItem = (key: ListKey, index: number, lang: Locale, next: string) =>
    setValue((prev) => {
      const list = prev[key].map((item, i) =>
        i === index ? { ...item, [lang]: next } : item,
      )
      return { ...prev, [key]: list }
    })

  const addListItem = (key: ListKey) =>
    setValue((prev) => ({ ...prev, [key]: [...prev[key], emptyBilingual()] }))

  const removeListItem = (key: ListKey, index: number) =>
    setValue((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }))

  const updateGalleryItem = (
    index: number,
    patch: Partial<ProjectFormGalleryValue>,
  ) =>
    setValue((prev) => {
      const gallery = [...prev.gallery]
      gallery[index] = { ...gallery[index], ...patch }
      return { ...prev, gallery }
    })

  const updateGalleryCaption = (index: number, lang: Locale, next: string) =>
    setValue((prev) => {
      const gallery = prev.gallery.map((item, i) =>
        i === index ? { ...item, caption: { ...item.caption, [lang]: next } } : item,
      )
      return { ...prev, gallery }
    })

  const addGalleryItem = () =>
    setValue((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          caption: emptyBilingual(),
          imageId: null,
          imageUrl: null,
          imageKind: null,
          bgClass: '',
        },
      ],
    }))

  const removeGalleryItem = (index: number) =>
    setValue((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))

  const heroPickerValue: MediaPickerValue = {
    id: value.imageId,
    url: value.imageUrl,
    kind: value.imageKind,
  }

  const handleHeroChange = (next: MediaPickerValue) =>
    setValue((prev) => ({
      ...prev,
      imageId: next.id,
      imageUrl: next.url,
      imageKind: next.kind,
    }))

  // Translate everything currently in the active language into the other one.
  const handleAutoTranslate = async () => {
    const from = editLang
    const to = otherLang
    const snapshot = value

    const texts: string[] = [
      snapshot.summary[from],
      snapshot.description[from],
      snapshot.role[from],
      ...snapshot.highlights.map((h) => h[from]),
      ...snapshot.responsibilities.map((r) => r[from]),
      ...snapshot.gallery.map((g) => g.caption[from]),
    ]

    if (!texts.some((t) => t.trim())) {
      setError(`Nothing to translate in ${from.toUpperCase()} yet.`)
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
        throw new Error(data.error ?? `Translation failed (${response.status}).`)
      }
      const { translations } = (await response.json()) as { translations: string[] }

      let k = 0
      const next = (src: string, current: string) => {
        const translated = translations[k++] ?? ''
        return src.trim() ? translated : current
      }

      setValue((prev) => ({
        ...prev,
        summary: { ...prev.summary, [to]: next(snapshot.summary[from], prev.summary[to]) },
        description: {
          ...prev.description,
          [to]: next(snapshot.description[from], prev.description[to]),
        },
        role: { ...prev.role, [to]: next(snapshot.role[from], prev.role[to]) },
        highlights: prev.highlights.map((item, i) => ({
          ...item,
          [to]: next(snapshot.highlights[i]?.[from] ?? '', item[to]),
        })),
        responsibilities: prev.responsibilities.map((item, i) => ({
          ...item,
          [to]: next(snapshot.responsibilities[i]?.[from] ?? '', item[to]),
        })),
        gallery: prev.gallery.map((item, i) => ({
          ...item,
          caption: {
            ...item.caption,
            [to]: next(snapshot.gallery[i]?.caption[from] ?? '', item.caption[to]),
          },
        })),
      }))
      setEditLang(to)
      setNotice(`Filled ${to.toUpperCase()} from ${from.toUpperCase()}. Review before saving.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!value.name.trim()) {
      setError('Project name is required.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: value.name.trim(),
        summary: value.summary,
        description: value.description,
        imageId: value.imageId,
        year: value.year.trim(),
        role: value.role,
        stack: value.stack.map((s) => s.trim()).filter(Boolean),
        highlights: value.highlights.filter(hasBilingualContent),
        responsibilities: value.responsibilities.filter(hasBilingualContent),
        gallery: value.gallery
          .map((item) => ({
            caption: item.caption,
            imageId: item.imageId,
          }))
          .filter((item) => item.imageId || hasBilingualContent(item.caption)),
      }

      const url = mode === 'create' ? '/api/projects' : `/api/projects/${projectId}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `Request failed with status ${response.status}`)
      }

      router.push('/dashboard/projects')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!projectId) return
    const confirmed = window.confirm(
      'Delete this project? This action cannot be undone.',
    )
    if (!confirmed) return

    setIsDeleting(true)
    setError(null)
    try {
      const response = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? `Request failed with status ${response.status}`)
      }
      router.push('/dashboard/projects')
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

      {/* Language editing controls */}
      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className={labelClass}>Editing language</span>
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
        <button
          type="button"
          onClick={handleAutoTranslate}
          className={ghostBtn}
          disabled={busy}
          title={`Translate ${editLang.toUpperCase()} content into ${otherLang.toUpperCase()}`}
        >
          {isTranslating
            ? 'Translating…'
            : `Auto-translate ${editLang.toUpperCase()} → ${otherLang.toUpperCase()}`}
        </button>
      </div>

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold tracking-wide text-white/80">Basic info</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className={labelClass}>Name *</span>
            <input
              className={inputClass}
              value={value.name}
              onChange={(e) => setValue((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Productivity Dashboard"
            />
          </label>
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className={labelClass}>Summary ({editLang.toUpperCase()})</span>
            <input
              className={inputClass}
              value={value.summary[editLang]}
              onChange={(e) => updateBilingual('summary', editLang, e.target.value)}
              placeholder="One-line description for the card."
            />
          </label>
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className={labelClass}>Description ({editLang.toUpperCase()})</span>
            <textarea
              className={`${inputClass} min-h-[120px]`}
              value={value.description[editLang]}
              onChange={(e) => updateBilingual('description', editLang, e.target.value)}
              placeholder="Detailed description shown on the detail panel."
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Year</span>
            <input
              className={inputClass}
              value={value.year}
              onChange={(e) => setValue((prev) => ({ ...prev, year: e.target.value }))}
              placeholder="2024"
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
          <div className="sm:col-span-2">
            <MediaPicker
              label="Hero media"
              value={heroPickerValue}
              onChange={handleHeroChange}
              accept="both"
            />
          </div>
        </div>
      </section>

      <ListSection
        title="Tech stack"
        items={value.stack}
        onAdd={() => setValue((prev) => ({ ...prev, stack: [...prev.stack, ''] }))}
        onRemove={(i) =>
          setValue((prev) => ({ ...prev, stack: prev.stack.filter((_, idx) => idx !== i) }))
        }
        onChange={(i, v) =>
          setValue((prev) => {
            const stack = [...prev.stack]
            stack[i] = v
            return { ...prev, stack }
          })
        }
        placeholder="Next.js"
      />

      <BilingualListSection
        title="Highlights"
        lang={editLang}
        items={value.highlights}
        onAdd={() => addListItem('highlights')}
        onRemove={(i) => removeListItem('highlights', i)}
        onChange={(i, v) => updateListItem('highlights', i, editLang, v)}
        placeholder="Role-based analytics with custom filters."
      />

      <BilingualListSection
        title="Responsibilities"
        lang={editLang}
        items={value.responsibilities}
        onAdd={() => addListItem('responsibilities')}
        onRemove={(i) => removeListItem('responsibilities', i)}
        onChange={(i, v) => updateListItem('responsibilities', i, editLang, v)}
        placeholder="Owned frontend architecture."
      />

      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-white/80">Gallery</h3>
          <button type="button" onClick={addGalleryItem} className={ghostBtn}>
            + Add media
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {value.gallery.length === 0 && (
            <p className="text-xs text-white/40">No gallery items yet.</p>
          )}
          {value.gallery.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                  Media #{index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeGalleryItem(index)}
                  className="text-xs text-rose-200/80 hover:text-rose-200"
                >
                  Remove
                </button>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <MediaPicker
                    label="Media"
                    accept="both"
                    value={{
                      id: item.imageId,
                      url: item.imageUrl,
                      kind: item.imageKind,
                    }}
                    onChange={(next) =>
                      updateGalleryItem(index, {
                        imageId: next.id,
                        imageUrl: next.url,
                        imageKind: next.kind,
                      })
                    }
                  />
                </div>
                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className={labelClass}>Caption ({editLang.toUpperCase()})</span>
                  <input
                    className={inputClass}
                    value={item.caption[editLang]}
                    onChange={(e) => updateGalleryCaption(index, editLang, e.target.value)}
                    placeholder="Overview analytics."
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/projects')}
            className={ghostBtn}
            disabled={busy}
          >
            Cancel
          </button>
          {mode === 'edit' && (
            <button
              type="button"
              onClick={handleDelete}
              className={dangerBtn}
              disabled={busy}
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </div>
        <button type="submit" className={primaryBtn} disabled={busy}>
          {isSubmitting
            ? mode === 'create'
              ? 'Creating…'
              : 'Saving…'
            : mode === 'create'
              ? 'Create project'
              : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

interface ListSectionProps {
  title: string
  items: string[]
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, value: string) => void
  placeholder?: string
}

const ListSection = ({
  title,
  items,
  onAdd,
  onRemove,
  onChange,
  placeholder,
}: ListSectionProps) => (
  <section className={sectionClass}>
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold tracking-wide text-white/80">{title}</h3>
      <button type="button" onClick={onAdd} className={ghostBtn}>
        + Add
      </button>
    </div>
    <div className="mt-4 flex flex-col gap-3">
      {items.length === 0 && <p className="text-xs text-white/40">No entries yet.</p>}
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <input
            className={inputClass}
            value={item}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 transition hover:border-rose-500/30 hover:text-rose-200"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  </section>
)

interface BilingualListSectionProps {
  title: string
  lang: Locale
  items: BilingualValue[]
  onAdd: () => void
  onRemove: (index: number) => void
  onChange: (index: number, value: string) => void
  placeholder?: string
}

const BilingualListSection = ({
  title,
  lang,
  items,
  onAdd,
  onRemove,
  onChange,
  placeholder,
}: BilingualListSectionProps) => (
  <section className={sectionClass}>
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold tracking-wide text-white/80">
        {title} <span className="text-white/40">({lang.toUpperCase()})</span>
      </h3>
      <button type="button" onClick={onAdd} className={ghostBtn}>
        + Add
      </button>
    </div>
    <div className="mt-4 flex flex-col gap-3">
      {items.length === 0 && <p className="text-xs text-white/40">No entries yet.</p>}
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <textarea
            className={`${inputClass} min-h-[60px]`}
            value={item[lang]}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70 transition hover:border-rose-500/30 hover:text-rose-200"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  </section>
)
