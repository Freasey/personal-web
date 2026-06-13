import 'server-only'

import { getSql, hasDb, tryGetSql } from '@/lib/db'

// ---------------------------------------------------------------------------
// User-agent parsing — lightweight, dependency-free. Good enough to label a
// visit as Mobile/Tablet/Desktop/Bot and name the browser + OS. Not meant to
// be exhaustive; falls back to "Unknown".
// ---------------------------------------------------------------------------

export interface ParsedUserAgent {
  device: string
  browser: string
  os: string
}

export const parseUserAgent = (ua: string | null | undefined): ParsedUserAgent => {
  const s = (ua ?? '').toLowerCase()

  if (!s) return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' }

  const isBot = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|whatsapp|telegram|headless|lighthouse|monitor/.test(s)

  // Device
  let device = 'Desktop'
  if (isBot) device = 'Bot'
  else if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) device = 'Tablet'
  else if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry|bb10|opera mini/.test(s)) device = 'Mobile'

  // Browser (order matters: most specific first)
  let browser = 'Unknown'
  if (/edg\//.test(s)) browser = 'Edge'
  else if (/opr\/|opera/.test(s)) browser = 'Opera'
  else if (/samsungbrowser/.test(s)) browser = 'Samsung Internet'
  else if (/chrome|crios/.test(s) && !/edg\//.test(s)) browser = 'Chrome'
  else if (/firefox|fxios/.test(s)) browser = 'Firefox'
  else if (/safari/.test(s) && !/chrome|crios/.test(s)) browser = 'Safari'
  else if (isBot) browser = 'Bot'

  // OS
  let os = 'Unknown'
  if (/windows nt 10|windows nt 11/.test(s)) os = 'Windows'
  else if (/windows/.test(s)) os = 'Windows'
  else if (/iphone|ipad|ipod/.test(s)) os = 'iOS'
  else if (/mac os x|macintosh/.test(s)) os = 'macOS'
  else if (/android/.test(s)) os = 'Android'
  else if (/linux/.test(s)) os = 'Linux'

  return { device, browser, os }
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

export interface RecordVisitInput {
  visitorId: string
  ipAddress: string | null
  userAgent: string | null
  path: string | null
  referrer: string | null
  country: string | null
  city: string | null
  isNew: boolean
}

/** Insert one visit row. Silently no-ops when the database is unavailable. */
export const recordVisit = async (input: RecordVisitInput): Promise<void> => {
  if (!hasDb) return

  const sql = getSql()
  const { device, browser, os } = parseUserAgent(input.userAgent)

  await sql`
    insert into visits
      (visitor_id, ip_address, user_agent, device, browser, os, path, referrer, country, city, is_new)
    values
      (${input.visitorId}, ${input.ipAddress}, ${input.userAgent}, ${device}, ${browser}, ${os},
       ${input.path}, ${input.referrer}, ${input.country}, ${input.city}, ${input.isNew})`
}

// ---------------------------------------------------------------------------
// Reads (dashboard)
// ---------------------------------------------------------------------------

export interface VisitStats {
  visitsThisMonth: number
  uniqueThisMonth: number
  newThisMonth: number
  visitsToday: number
  totalAllTime: number
  uniqueAllTime: number
}

export interface VisitRow {
  id: string
  ip_address: string | null
  user_agent: string | null
  device: string | null
  browser: string | null
  os: string | null
  path: string | null
  referrer: string | null
  country: string | null
  city: string | null
  is_new: boolean
  created_at: string
}

const EMPTY_STATS: VisitStats = {
  visitsThisMonth: 0,
  uniqueThisMonth: 0,
  newThisMonth: 0,
  visitsToday: 0,
  totalAllTime: 0,
  uniqueAllTime: 0,
}

const toNumber = (value: unknown): number => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

/** Aggregate visit counters. Returns zeros when the database is unavailable. */
export const getVisitStats = async (): Promise<VisitStats> => {
  const sql = tryGetSql()
  if (!sql) return EMPTY_STATS

  try {
    const rows = (await sql`
      select
        count(*) filter (where created_at >= date_trunc('month', now()))                       as visits_this_month,
        count(distinct visitor_id) filter (where created_at >= date_trunc('month', now()))     as unique_this_month,
        count(*) filter (where is_new and created_at >= date_trunc('month', now()))            as new_this_month,
        count(*) filter (where created_at >= date_trunc('day', now()))                          as visits_today,
        count(*)                                                                                as total_all_time,
        count(distinct visitor_id)                                                              as unique_all_time
      from visits
    `) as Record<string, unknown>[]

    const r = rows[0] ?? {}
    return {
      visitsThisMonth: toNumber(r.visits_this_month),
      uniqueThisMonth: toNumber(r.unique_this_month),
      newThisMonth: toNumber(r.new_this_month),
      visitsToday: toNumber(r.visits_today),
      totalAllTime: toNumber(r.total_all_time),
      uniqueAllTime: toNumber(r.unique_all_time),
    }
  } catch {
    return EMPTY_STATS
  }
}

/** Most recent visits, newest first. Returns [] when the database is unavailable. */
export const getRecentVisits = async (limit = 50): Promise<VisitRow[]> => {
  const sql = tryGetSql()
  if (!sql) return []

  try {
    const rows = (await sql`
      select id, ip_address, user_agent, device, browser, os, path, referrer,
             country, city, is_new, created_at
      from visits
      order by created_at desc
      limit ${limit}
    `) as VisitRow[]
    return rows
  } catch {
    return []
  }
}
