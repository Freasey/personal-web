import { createHmac, timingSafeEqual } from 'node:crypto'

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

const decodeBase32 = (input: string): Buffer => {
  const cleaned = input.replace(/=+$/g, '').replace(/\s+/g, '').toUpperCase()
  let bits = ''

  for (const char of cleaned) {
    const index = BASE32_ALPHABET.indexOf(char)
    if (index === -1) {
      throw new Error('Invalid base32 character in TOTP secret')
    }
    bits += index.toString(2).padStart(5, '0')
  }

  const bytes: number[] = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2))
  }

  return Buffer.from(bytes)
}

const hotp = (key: Buffer, counter: number, digits: number): string => {
  const counterBuffer = Buffer.alloc(8)
  // Write 64-bit counter (big endian); JS bitwise ops are 32-bit so split.
  counterBuffer.writeUInt32BE(Math.floor(counter / 0x100000000), 0)
  counterBuffer.writeUInt32BE(counter >>> 0, 4)

  const hmac = createHmac('sha1', key).update(counterBuffer).digest()
  const offset = hmac[hmac.length - 1] & 0x0f
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)

  const otp = (binary % 10 ** digits).toString().padStart(digits, '0')
  return otp
}

interface VerifyOptions {
  secret: string
  token: string
  step?: number
  digits?: number
  window?: number
}

export const verifyTotp = ({
  secret,
  token,
  step = 30,
  digits = 6,
  window = 1,
}: VerifyOptions): boolean => {
  const cleanedToken = token.replace(/\s+/g, '')
  if (!/^\d+$/.test(cleanedToken) || cleanedToken.length !== digits) {
    return false
  }

  const key = decodeBase32(secret)
  const counter = Math.floor(Date.now() / 1000 / step)
  const tokenBuffer = Buffer.from(cleanedToken)

  for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
    const candidate = hotp(key, counter + errorWindow, digits)
    const candidateBuffer = Buffer.from(candidate)
    if (
      candidateBuffer.length === tokenBuffer.length &&
      timingSafeEqual(candidateBuffer, tokenBuffer)
    ) {
      return true
    }
  }

  return false
}
