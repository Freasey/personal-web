'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

export interface ProjectFormGalleryValue {
  alt: string
  caption: string
  image: string
  bgClass: string
}

export interface ProjectFormValue {
  name: string
  summary: string
  description: string
  image: string
  bgClass: string
  year: string
  role: string
  stack: string[]
  highlights: string[]
  responsibilities: string[]
  gallery: ProjectFormGalleryValue[]
}

export const emptyProjectFormValue: ProjectFormValue = {
  name: '',
  summary: '',
  description: '',
  image: '',
  bgClass: '',
  year: '',
  role: '',
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

export const ProjectForm = ({ mode, projectId, initialValue }: ProjectFormProps) => {
  const router = useRouter()
  const [value, setValue] = useState<ProjectFormValue>(initialValue)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = <K extends keyof ProjectFormValue>(
    key: K,
    next: ProjectFormValue[K],
  ) => setValue((prev) => ({ ...prev, [key]: next }))

  const updateListItem = (
    key: 'stack' | 'highlights' | 'responsibilities',
    index: number,
    next: string,
  ) =>
    setValue((prev) => {
      const list = [...prev[key]]
      list[index] = next
      return { ...prev, [key]: list }
    })

  const addListItem = (key: 'stack' | 'highlights' | 'responsibilities') =>
    setValue((prev) => ({ ...prev, [key]: [...prev[key], ''] }))

  const removeListItem = (
    key: 'stack' | 'highlights' | 'responsibilities',
    index: number,
  ) =>
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

  const addGalleryItem = () =>
    setValue((prev) => ({
      ...prev,
      gallery: [...prev.gallery, { alt: '', caption: '', image: '', bgClass: '' }],
    }))

  const removeGalleryItem = (index: number) =>
    setValue((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))

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
        summary: value.summary.trim(),
        description: value.description.trim(),
        image: value.image.trim() || undefined,
        bgClass: value.bgClass.trim() || undefined,
        year: value.year.trim(),
        role: value.role.trim(),
        stack: value.stack.map((s) => s.trim()).filter(Boolean),
        highlights: value.highlights.map((s) => s.trim()).filter(Boolean),
        responsibilities: value.responsibilities.map((s) => s.trim()).filter(Boolean),
        gallery: value.gallery
          .map((item) => ({
            alt: item.alt.trim(),
            caption: item.caption.trim(),
            image: item.image.trim() || undefined,
            bgClass: item.bgClass.trim() || undefined,
          }))
          .filter((item) => item.alt || item.caption || item.image),
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <section className={sectionClass}>
        <h3 className="text-sm font-semibold tracking-wide text-white/80">Basic info</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className={labelClass}>Name *</span>
            <input
              className={inputClass}
              value={value.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Productivity Dashboard"
            />
          </label>
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className={labelClass}>Summary</span>
            <input
              className={inputClass}
              value={value.summary}
              onChange={(e) => updateField('summary', e.target.value)}
              placeholder="One-line description for the card."
            />
          </label>
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className={labelClass}>Description</span>
            <textarea
              className={`${inputClass} min-h-[120px]`}
              value={value.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Detailed description shown on the detail panel."
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Year</span>
            <input
              className={inputClass}
              value={value.year}
              onChange={(e) => updateField('year', e.target.value)}
              placeholder="2024"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Role</span>
            <input
              className={inputClass}
              value={value.role}
              onChange={(e) => updateField('role', e.target.value)}
              placeholder="Fullstack Engineer"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Image URL / pathname</span>
            <input
              className={inputClass}
              value={value.image}
              onChange={(e) => updateField('image', e.target.value)}
              placeholder="project-dashboard.jpeg"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className={labelClass}>Background class</span>
            <input
              className={inputClass}
              value={value.bgClass}
              onChange={(e) => updateField('bgClass', e.target.value)}
              placeholder="from-indigo-900 via-slate-900 to-slate-800"
            />
          </label>
        </div>
      </section>

      <ListSection
        title="Tech stack"
        items={value.stack}
        onAdd={() => addListItem('stack')}
        onRemove={(i) => removeListItem('stack', i)}
        onChange={(i, v) => updateListItem('stack', i, v)}
        placeholder="Next.js"
      />

      <ListSection
        title="Highlights"
        items={value.highlights}
        onAdd={() => addListItem('highlights')}
        onRemove={(i) => removeListItem('highlights', i)}
        onChange={(i, v) => updateListItem('highlights', i, v)}
        placeholder="Role-based analytics with custom filters."
        multiline
      />

      <ListSection
        title="Responsibilities"
        items={value.responsibilities}
        onAdd={() => addListItem('responsibilities')}
        onRemove={(i) => removeListItem('responsibilities', i)}
        onChange={(i, v) => updateListItem('responsibilities', i, v)}
        placeholder="Owned frontend architecture."
        multiline
      />

      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold tracking-wide text-white/80">Gallery</h3>
          <button type="button" onClick={addGalleryItem} className={ghostBtn}>
            + Add image
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
                  Image #{index + 1}
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
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Image URL / pathname</span>
                  <input
                    className={inputClass}
                    value={item.image}
                    onChange={(e) =>
                      updateGalleryItem(index, { image: e.target.value })
                    }
                    placeholder="project-dashboard-hero.jpeg"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className={labelClass}>Alt text</span>
                  <input
                    className={inputClass}
                    value={item.alt}
                    onChange={(e) => updateGalleryItem(index, { alt: e.target.value })}
                    placeholder="Dashboard overview"
                  />
                </label>
                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className={labelClass}>Caption</span>
                  <input
                    className={inputClass}
                    value={item.caption}
                    onChange={(e) =>
                      updateGalleryItem(index, { caption: e.target.value })
                    }
                    placeholder="Overview analytics."
                  />
                </label>
                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className={labelClass}>Background class</span>
                  <input
                    className={inputClass}
                    value={item.bgClass}
                    onChange={(e) =>
                      updateGalleryItem(index, { bgClass: e.target.value })
                    }
                    placeholder="from-indigo-900 via-slate-900 to-slate-800"
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
            disabled={isSubmitting || isDeleting}
          >
            Cancel
          </button>
          {mode === 'edit' && (
            <button
              type="button"
              onClick={handleDelete}
              className={dangerBtn}
              disabled={isSubmitting || isDeleting}
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </div>
        <button type="submit" className={primaryBtn} disabled={isSubmitting || isDeleting}>
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
  multiline?: boolean
}

const ListSection = ({
  title,
  items,
  onAdd,
  onRemove,
  onChange,
  placeholder,
  multiline,
}: ListSectionProps) => (
  <section className={sectionClass}>
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold tracking-wide text-white/80">{title}</h3>
      <button type="button" onClick={onAdd} className={ghostBtn}>
        + Add
      </button>
    </div>
    <div className="mt-4 flex flex-col gap-3">
      {items.length === 0 && (
        <p className="text-xs text-white/40">No entries yet.</p>
      )}
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          {multiline ? (
            <textarea
              className={`${inputClass} min-h-[60px]`}
              value={item}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={placeholder}
            />
          ) : (
            <input
              className={inputClass}
              value={item}
              onChange={(e) => onChange(index, e.target.value)}
              placeholder={placeholder}
            />
          )}
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
