import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const toBase64Url = (input) => Buffer.from(input).toString('base64url')
const fromBase64Url = (input) => Buffer.from(input, 'base64url').toString('utf8')

export const hashSecret = (secret) => {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(secret, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export const verifySecret = (secret, stored) => {
  if (!stored || !stored.includes(':')) {
    return false
  }

  const [salt, expectedHash] = stored.split(':')
  const derivedHash = scryptSync(secret, salt, 64).toString('hex')

  const expected = Buffer.from(expectedHash, 'hex')
  const derived = Buffer.from(derivedHash, 'hex')

  if (expected.length !== derived.length) {
    return false
  }

  return timingSafeEqual(expected, derived)
}

export const signToken = (payload, secret, expiresInSec = 3600) => {
  const now = Math.floor(Date.now() / 1000)
  const completePayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSec,
  }

  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = toBase64Url(JSON.stringify(header))
  const encodedPayload = toBase64Url(JSON.stringify(completePayload))
  const unsigned = `${encodedHeader}.${encodedPayload}`
  const signature = createHmac('sha256', secret).update(unsigned).digest('base64url')

  return `${unsigned}.${signature}`
}

export const verifyToken = (token, secret) => {
  if (!token || typeof token !== 'string') {
    return null
  }

  const [encodedHeader, encodedPayload, signature] = token.split('.')
  if (!encodedHeader || !encodedPayload || !signature) {
    return null
  }

  const unsigned = `${encodedHeader}.${encodedPayload}`
  const expectedSignature = createHmac('sha256', secret).update(unsigned).digest('base64url')

  const expected = Buffer.from(expectedSignature)
  const received = Buffer.from(signature)

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload))
    const now = Math.floor(Date.now() / 1000)
    if (!payload.exp || payload.exp < now) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
