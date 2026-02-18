import { createServer } from 'node:http'
import { randomInt } from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { loadEnv } from './lib/env.mjs'
import { getDoctors, setDoctors } from './lib/store.mjs'
import { hashSecret, signToken, verifySecret, verifyToken } from './lib/security.mjs'
import { sendOtpEmail } from './lib/mailer.mjs'

loadEnv()

const PORT = Number(process.env.API_PORT || 8787)
const HOST = process.env.API_HOST || '127.0.0.1'
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || 'change-this-secret'
const ADMIN_SIGNUP_KEY_HASH = process.env.ADMIN_SIGNUP_KEY_HASH || ''
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || ''
const SESSION_COOKIE_NAME = 'mmc_admin_session'

const OTP_LENGTH = 6
const OTP_EXPIRY_SECONDS = 120
const OTP_COOLDOWN_SECONDS = 30
const OTP_MAX_VERIFY_ATTEMPTS = 3
const OTP_LOCKOUT_MINUTES = 5
const OTP_DEBUG = process.env.OTP_DEBUG === 'true' && process.env.NODE_ENV !== 'production'

const otpStore = new Map()
const rateLimitStore = new Map()

const iconDoctor = (doctor) => ({
  photo: doctor.photo || '',
  registrationId: doctor.registrationId || '',
  email: doctor.email || '',
  name: doctor.name || '',
  degree: doctor.degree || '',
  specialization: doctor.specialization || '',
  phone: doctor.phone || '',
  practiceAddress: doctor.practiceAddress || '',
})

const normalize = (value) => String(value || '').trim().toLowerCase()
const normalizeRegId = (value) => String(value || '').trim().toUpperCase()
const nowMs = () => Date.now()
const genericOtpMessage = 'If your details are valid, an OTP will be sent to your registered email.'

const getClientIp = (req) => {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff) {
    return xff.split(',')[0].trim()
  }

  return req.socket.remoteAddress || 'unknown'
}

const checkRateLimit = (key, limit, windowMs) => {
  const now = nowMs()
  const state = rateLimitStore.get(key)

  if (!state || state.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfter: 0 }
  }

  if (state.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((state.resetAt - now) / 1000) }
  }

  state.count += 1
  rateLimitStore.set(key, state)
  return { allowed: true, retryAfter: 0 }
}

const sendJson = (res, statusCode, data, extraHeaders = {}) => {
  const requestOrigin = res.req?.headers?.origin || ''
  const allowOrigin =
    requestOrigin &&
    (requestOrigin === CLIENT_ORIGIN ||
      CLIENT_ORIGINS.includes(requestOrigin) ||
      /^http:\/\/localhost:\d+$/.test(requestOrigin))
      ? requestOrigin
      : CLIENT_ORIGIN

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    ...extraHeaders,
  }

  res.writeHead(statusCode, headers)
  res.end(JSON.stringify(data))
}

const parseBody = async (req) => {
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }

  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) {
    return {}
  }

  try {
    return JSON.parse(raw)
  } catch {
    throw new Error('Invalid JSON body')
  }
}

const parseCookies = (cookieHeader) => {
  if (!cookieHeader) {
    return {}
  }

  return cookieHeader.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=')
    if (!key) {
      return acc
    }

    acc[key] = decodeURIComponent(rest.join('='))
    return acc
  }, {})
}

const getAdminPayload = (req) => {
  const cookies = parseCookies(req.headers.cookie)
  const token = cookies[SESSION_COOKIE_NAME]
  if (!token) {
    return null
  }

  const payload = verifyToken(token, AUTH_TOKEN_SECRET)
  if (!payload || payload.sub !== 'admin') {
    return null
  }

  return payload
}

const makeSessionCookie = (token) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=43200${secure}`
}

const clearSessionCookie = () => `${SESSION_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`

const generateOtp = () => randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH).toString()

const verifyAdminConfig = () => {
  if (!ADMIN_SIGNUP_KEY_HASH || !ADMIN_PASSWORD_HASH) {
    return {
      ok: false,
      message:
        'Admin credentials are not configured. Add ADMIN_SIGNUP_KEY_HASH and ADMIN_PASSWORD_HASH to .env (use scripts/generate-admin-credentials.mjs).',
    }
  }

  return { ok: true }
}

export const requestHandler = async (req, res) => {
  if (!req.url) {
    return sendJson(res, 404, { message: 'Not found' })
  }

  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {})
  }

  const url = new URL(req.url, `http://${req.headers.host}`)

  try {
    if (req.method === 'GET' && url.pathname === '/api/health') {
      const config = verifyAdminConfig()
      if (!config.ok) {
        return sendJson(res, 503, { ok: false, message: config.message })
      }

      return sendJson(res, 200, { ok: true })
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/admin/login') {
      const config = verifyAdminConfig()
      if (!config.ok) {
        return sendJson(res, 500, { message: config.message })
      }

      const body = await parseBody(req)
      const signupKey = String(body.signupKey || '')
      const password = String(body.password || '')

      const isSignupKeyValid = verifySecret(signupKey, ADMIN_SIGNUP_KEY_HASH)
      const isPasswordValid = verifySecret(password, ADMIN_PASSWORD_HASH)

      if (!isSignupKeyValid || !isPasswordValid) {
        return sendJson(res, 401, { message: 'Invalid signup key or password.' })
      }

      const token = signToken({ sub: 'admin' }, AUTH_TOKEN_SECRET, 60 * 60 * 12)
      return sendJson(res, 200, { authenticated: true }, { 'Set-Cookie': makeSessionCookie(token) })
    }

    if (req.method === 'GET' && url.pathname === '/api/auth/admin/session') {
      const payload = getAdminPayload(req)
      return sendJson(res, 200, { authenticated: !!payload })
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/admin/logout') {
      return sendJson(res, 200, { success: true }, { 'Set-Cookie': clearSessionCookie() })
    }

    if (url.pathname.startsWith('/api/admin/')) {
      const payload = getAdminPayload(req)
      if (!payload) {
        return sendJson(res, 401, { message: 'Admin authentication required.' })
      }

      if (req.method === 'GET' && url.pathname === '/api/admin/doctors') {
        return sendJson(res, 200, { doctors: getDoctors().map(iconDoctor) })
      }

      if (req.method === 'POST' && url.pathname === '/api/admin/doctors') {
        const body = await parseBody(req)
        const doctor = iconDoctor(body)

        if (!doctor.name || !doctor.degree || !doctor.registrationId || !doctor.email) {
          return sendJson(res, 400, { message: 'Name, degree, registrationId and email are required.' })
        }

        const doctors = getDoctors()
        const exists = doctors.some(
          (item) => normalizeRegId(item.registrationId) === normalizeRegId(doctor.registrationId) || normalize(item.email) === normalize(doctor.email),
        )

        if (exists) {
          return sendJson(res, 409, { message: 'Doctor already exists with this registrationId or email.' })
        }

        setDoctors([...doctors, doctor])
        return sendJson(res, 201, { doctor })
      }

      if (req.method === 'PUT' && url.pathname.startsWith('/api/admin/doctors/')) {
        const registrationId = decodeURIComponent(url.pathname.replace('/api/admin/doctors/', ''))
        const body = await parseBody(req)
        const nextDoctor = iconDoctor(body)

        const doctors = getDoctors()
        const index = doctors.findIndex((item) => normalizeRegId(item.registrationId) === normalizeRegId(registrationId))

        if (index === -1) {
          return sendJson(res, 404, { message: 'Doctor not found.' })
        }

        if (!nextDoctor.name || !nextDoctor.degree || !nextDoctor.registrationId || !nextDoctor.email) {
          return sendJson(res, 400, { message: 'Name, degree, registrationId and email are required.' })
        }

        const duplicate = doctors.some((item, itemIndex) => {
          if (itemIndex === index) {
            return false
          }

          return (
            normalizeRegId(item.registrationId) === normalizeRegId(nextDoctor.registrationId) ||
            normalize(item.email) === normalize(nextDoctor.email)
          )
        })

        if (duplicate) {
          return sendJson(res, 409, { message: 'Another doctor exists with this registrationId or email.' })
        }

        doctors[index] = nextDoctor
        setDoctors(doctors)
        return sendJson(res, 200, { doctor: nextDoctor })
      }

      if (req.method === 'DELETE' && url.pathname.startsWith('/api/admin/doctors/')) {
        const registrationId = decodeURIComponent(url.pathname.replace('/api/admin/doctors/', ''))
        const doctors = getDoctors()
        const nextDoctors = doctors.filter((item) => normalizeRegId(item.registrationId) !== normalizeRegId(registrationId))

        if (nextDoctors.length === doctors.length) {
          return sendJson(res, 404, { message: 'Doctor not found.' })
        }

        setDoctors(nextDoctors)
        return sendJson(res, 200, { success: true })
      }
    }

    if (req.method === 'POST' && url.pathname === '/api/rmp/request-otp') {
      const requestIp = getClientIp(req)
      const ipLimit = checkRateLimit(`otp:request:${requestIp}`, 20, 10 * 60 * 1000)
      if (!ipLimit.allowed) {
        return sendJson(res, 429, { message: `Too many requests. Try again in ${ipLimit.retryAfter}s.` })
      }

      const body = await parseBody(req)
      const registrationId = String(body.registrationId || '').trim()
      const email = String(body.email || '').trim().toLowerCase()

      if (!registrationId || !email) {
        return sendJson(res, 400, { message: 'registrationId and email are required.' })
      }

      const doctors = getDoctors()
      const doctor = doctors.find(
        (item) => normalizeRegId(item.registrationId) === normalizeRegId(registrationId) && normalize(item.email) === normalize(email),
      )

      const key = `${normalizeRegId(registrationId)}|${normalize(email)}`
      const current = otpStore.get(key)
      const now = nowMs()

      if (current?.lockedUntil && current.lockedUntil > now) {
        const waitSeconds = Math.ceil((current.lockedUntil - now) / 1000)
        return sendJson(res, 429, { message: `Too many attempts. Try again in ${waitSeconds}s.` })
      }

      if (current?.lastSentAt && current.lastSentAt + OTP_COOLDOWN_SECONDS * 1000 > now) {
        const waitSeconds = Math.ceil((current.lastSentAt + OTP_COOLDOWN_SECONDS * 1000 - now) / 1000)
        return sendJson(res, 429, { message: `Please wait ${waitSeconds}s before requesting another OTP.` })
      }

      if (!doctor) {
        return sendJson(res, 200, {
          success: true,
          message: genericOtpMessage,
        })
      }

      const otp = generateOtp()
      const otpHash = hashSecret(otp)

      otpStore.set(key, {
        otpHash,
        expiresAt: now + OTP_EXPIRY_SECONDS * 1000,
        lastSentAt: now,
        attempts: 0,
        lockedUntil: 0,
      })

      const sendResult = await sendOtpEmail({
        toEmail: doctor.email,
        doctorName: doctor.name,
        otp,
      })

      return sendJson(res, 200, {
        success: true,
        message: genericOtpMessage,
        expiresInSeconds: OTP_EXPIRY_SECONDS,
        simulated: !!sendResult.simulated,
        ...(OTP_DEBUG && sendResult.simulated ? { demoOtp: otp } : {}),
      })
    }

    if (req.method === 'POST' && url.pathname === '/api/rmp/verify-otp') {
      const requestIp = getClientIp(req)
      const ipLimit = checkRateLimit(`otp:verify:${requestIp}`, 30, 10 * 60 * 1000)
      if (!ipLimit.allowed) {
        return sendJson(res, 429, { message: `Too many requests. Try again in ${ipLimit.retryAfter}s.` })
      }

      const body = await parseBody(req)
      const registrationId = String(body.registrationId || '').trim()
      const email = String(body.email || '').trim().toLowerCase()
      const otp = String(body.otp || '').trim()

      if (!registrationId || !email || !otp) {
        return sendJson(res, 400, { message: 'registrationId, email and otp are required.' })
      }

      const doctors = getDoctors()
      const doctor = doctors.find(
        (item) => normalizeRegId(item.registrationId) === normalizeRegId(registrationId) && normalize(item.email) === normalize(email),
      )

      if (!doctor) {
        return sendJson(res, 401, { message: 'Invalid credentials or OTP.' })
      }

      const key = `${normalizeRegId(registrationId)}|${normalize(email)}`
      const state = otpStore.get(key)
      const now = nowMs()

      if (!state) {
        return sendJson(res, 401, { message: 'Invalid credentials or OTP.' })
      }

      if (state.lockedUntil && state.lockedUntil > now) {
        const waitSeconds = Math.ceil((state.lockedUntil - now) / 1000)
        return sendJson(res, 429, { message: `Too many attempts. Try again in ${waitSeconds}s.` })
      }

      if (state.expiresAt < now) {
        otpStore.delete(key)
        return sendJson(res, 401, { message: 'Invalid credentials or OTP.' })
      }

      const matches = verifySecret(otp, state.otpHash)
      if (!matches) {
        state.attempts += 1

        if (state.attempts >= OTP_MAX_VERIFY_ATTEMPTS) {
          state.lockedUntil = now + OTP_LOCKOUT_MINUTES * 60 * 1000
          state.otpHash = ''
          state.expiresAt = 0
          otpStore.set(key, state)
          return sendJson(res, 429, { message: `Too many invalid OTP attempts. Locked for ${OTP_LOCKOUT_MINUTES} minutes.` })
        }

        otpStore.set(key, state)
        return sendJson(res, 401, { message: 'Invalid credentials or OTP.' })
      }

      otpStore.delete(key)
      return sendJson(res, 200, {
        success: true,
        doctor: iconDoctor(doctor),
      })
    }

    return sendJson(res, 404, { message: 'Not found' })
  } catch (error) {
    return sendJson(res, 500, { message: error.message || 'Internal server error' })
  }
}

export default requestHandler

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  const server = createServer(requestHandler)
  server.listen(PORT, HOST, () => {
    console.log(`MMC API running on http://${HOST}:${PORT}`)
  })
}
