import 'server-only'

// Provider-agnostic machine translation used by the dashboard to auto-fill the
// other language when saving content. Swap providers by setting
// TRANSLATE_PROVIDER; the default is Google Gemini (generous free tier, strong
// Indonesian). Everything else in the app talks to translateBatch / one place.

export type TranslateLocale = 'en' | 'id'

const LOCALE_NAMES: Record<TranslateLocale, string> = {
  en: 'English',
  id: 'Indonesian',
}

export interface TranslateProvider {
  readonly name: string
  /** Returns translations in the same order/length as `texts`. */
  translate(texts: string[], from: TranslateLocale, to: TranslateLocale): Promise<string[]>
}

export class TranslateConfigError extends Error {}

const buildPrompt = (texts: string[], from: TranslateLocale, to: TranslateLocale) =>
  [
    `Translate each item in the following JSON array from ${LOCALE_NAMES[from]} to ${LOCALE_NAMES[to]}.`,
    'Rules:',
    '- Keep technology names, product names, brand names, company names, and code identifiers untranslated (e.g. "Next.js", "REST API", "PostgreSQL", "WebSocket").',
    '- Preserve meaning and a natural, professional tone.',
    '- Do NOT add, remove, merge, or reorder items.',
    '- Return ONLY a JSON array of strings with exactly the same length and order. No prose, no markdown.',
    '',
    'Input:',
    JSON.stringify(texts),
  ].join('\n')

const parseJsonArray = (raw: string, expectedLength: number): string[] => {
  let text = raw.trim()
  // Strip ```json fences if a model wraps the response.
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  }
  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1)
  }
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed) || parsed.length !== expectedLength) {
    throw new Error('Translation provider returned an unexpected shape.')
  }
  return parsed.map((item) => (typeof item === 'string' ? item : String(item ?? '')))
}

// --- Gemini --------------------------------------------------------------------

const geminiProvider = (): TranslateProvider => {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY
  const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'

  return {
    name: 'gemini',
    async translate(texts, from, to) {
      if (!apiKey) {
        throw new TranslateConfigError(
          'GEMINI_API_KEY is not set. Add it to your environment to enable auto-translate.',
        )
      }
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: buildPrompt(texts, from, to) }] }],
          generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
        }),
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => '')
        throw new Error(`Gemini request failed (${response.status}). ${detail.slice(0, 300)}`)
      }

      const data = (await response.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[]
      }
      const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
      if (!text.trim()) {
        throw new Error('Gemini returned an empty response.')
      }
      return parseJsonArray(text, texts.length)
    },
  }
}

const PROVIDERS: Record<string, () => TranslateProvider> = {
  gemini: geminiProvider,
}

const getProvider = (): TranslateProvider => {
  const key = (process.env.TRANSLATE_PROVIDER ?? 'gemini').toLowerCase()
  const factory = PROVIDERS[key]
  if (!factory) {
    throw new TranslateConfigError(`Unknown TRANSLATE_PROVIDER "${key}".`)
  }
  return factory()
}

/** True when the active provider has the credentials it needs. */
export const isTranslationConfigured = (): boolean =>
  Boolean(process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY)

/** Translate a batch of strings, preserving order. Empty strings pass through. */
export const translateBatch = async (
  texts: string[],
  from: TranslateLocale,
  to: TranslateLocale,
): Promise<string[]> => {
  // Only send non-empty entries; stitch results back into original positions.
  const indexed = texts.map((text, index) => ({ text, index })).filter((e) => e.text.trim())
  if (indexed.length === 0) return texts.map(() => '')

  const provider = getProvider()
  const translated = await provider.translate(
    indexed.map((e) => e.text),
    from,
    to,
  )

  const result = texts.map(() => '')
  indexed.forEach((entry, i) => {
    result[entry.index] = translated[i] ?? ''
  })
  return result
}
