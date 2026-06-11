import 'server-only'

import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL

export const hasDb = Boolean(connectionString)

let cached: NeonQueryFunction<false, false> | null = null

/** Returns the Neon SQL tag. Throws if DATABASE_URL is missing (use for writes). */
export const getSql = (): NeonQueryFunction<false, false> => {
  if (!connectionString) {
    throw new Error('DATABASE_URL is required for database access.')
  }
  if (!cached) {
    cached = neon(connectionString)
  }
  return cached
}

/** Returns the Neon SQL tag, or null when DATABASE_URL is unset (use for reads with fallback). */
export const tryGetSql = (): NeonQueryFunction<false, false> | null =>
  connectionString ? getSql() : null
