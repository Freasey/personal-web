export const SESSION_COOKIE_NAME = 'dashboard_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8 // 8 hours

const encoder = new TextEncoder()

const toBase64Url = (input: ArrayBuffer | Uint8Array): string => {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

const fromBase64Url = (input: string): Uint8Array => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

const importKey = (secret: string) =>
  crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )

const timingSafeEqualBytes = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.byteLength !== b.byteLength) return false
  let diff = 0
  for (let i = 0; i < a.byteLength; i++) {
    diff |= a[i] ^ b[i]
  }
  return diff === 0
}

interface SessionPayload {
  iat: number
  exp: number
}

const getSecret = (): string => {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET is missing or too short (min 16 chars)')
  }
  return secret
}

export const createSessionCookie = async (): Promise<string> => {
  const now = Math.floor(Date.now() / 1000)
  const payload: SessionPayload = {
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  }
  const payloadJson = JSON.stringify(payload)
  const payloadEncoded = toBase64Url(encoder.encode(payloadJson))

  const key = await importKey(getSecret())
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payloadEncoded),
  )

  return `${payloadEncoded}.${toBase64Url(signature)}`
}

export const verifySessionCookie = async (
  cookie: string | undefined | null,
): Promise<boolean> => {
  if (!cookie) return false
  const parts = cookie.split('.')
  if (parts.length !== 2) return false
  const [payloadEncoded, signatureEncoded] = parts

  let signatureBytes: Uint8Array
  try {
    signatureBytes = fromBase64Url(signatureEncoded)
  } catch {
    return false
  }

  let key: CryptoKey
  try {
    key = await importKey(getSecret())
  } catch {
    return false
  }

  const expectedSig = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, encoder.encode(payloadEncoded)),
  )

  if (!timingSafeEqualBytes(signatureBytes, expectedSig)) return false

  try {
    const payloadJson = new TextDecoder().decode(fromBase64Url(payloadEncoded))
    const payload = JSON.parse(payloadJson) as SessionPayload
    const now = Math.floor(Date.now() / 1000)
    return typeof payload.exp === 'number' && payload.exp > now
  } catch {
    return false
  }
}
