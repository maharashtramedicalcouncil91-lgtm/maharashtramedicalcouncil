import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestRmpOtp, verifyRmpOtp } from '../services/apiClient'

const OTP_LENGTH = 6
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_MINUTES = 5

const createCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const isValidRegistrationId = (value) => /^[A-Za-z0-9/-]{6,20}$/.test(value)
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const RMPLogin = () => {
  const navigate = useNavigate()
  const [registrationId, setRegistrationId] = useState('')
  const [email, setEmail] = useState('')
  const [captchaCode, setCaptchaCode] = useState(createCaptcha)
  const [captchaInput, setCaptchaInput] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [otpRequested, setOtpRequested] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(0)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [clock, setClock] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setClock(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const lockoutLeft = Math.max(0, Math.ceil((lockedUntil - clock) / 1000))

  const lockoutLabel = useMemo(() => {
    if (!lockoutLeft) {
      return ''
    }

    const minutes = Math.floor(lockoutLeft / 60)
    const seconds = lockoutLeft % 60
    return `${minutes}m ${seconds}s`
  }, [lockoutLeft])

  const increaseFailedAttempts = () => {
    const next = loginAttempts + 1
    setLoginAttempts(next)

    if (next >= MAX_LOGIN_ATTEMPTS) {
      const lockUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000
      setLockedUntil(lockUntil)
      setOtpRequested(false)
      setStatus({ type: 'error', message: `Too many failed attempts. Locked for ${LOCKOUT_MINUTES} minutes.` })
      return true
    }

    return false
  }

  const validateBaseFields = () => {
    if (!isValidRegistrationId(registrationId)) {
      setStatus({ type: 'error', message: 'Registration ID must be 6-20 characters with letters, numbers, / or -.' })
      return false
    }

    if (!isValidEmail(email)) {
      setStatus({ type: 'error', message: 'Enter a valid registered email address.' })
      return false
    }

    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setCaptchaCode(createCaptcha())
      setCaptchaInput('')
      setStatus({ type: 'error', message: 'Captcha verification failed. Please try again.' })
      increaseFailedAttempts()
      return false
    }

    return true
  }

  const handleSendOtp = async () => {
    if (lockoutLeft > 0) {
      setStatus({ type: 'error', message: `Too many failed attempts. Try again in ${lockoutLabel}.` })
      return
    }

    if (!validateBaseFields()) {
      return
    }

    setSendingOtp(true)

    try {
      await requestRmpOtp({ registrationId, email })
      setOtpRequested(true)
      setOtpInput('')
      setStatus({ type: 'success', message: 'If your details are valid, an OTP has been sent to your registered email.' })
    } catch (error) {
      if (!increaseFailedAttempts()) {
        setStatus({ type: 'error', message: error.message })
      }
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerify = async () => {
    if (lockoutLeft > 0) {
      setStatus({ type: 'error', message: `Too many failed attempts. Try again in ${lockoutLabel}.` })
      return
    }

    if (!validateBaseFields()) {
      return
    }

    if (!otpRequested) {
      setStatus({ type: 'error', message: 'Please request OTP after captcha verification.' })
      return
    }

    if (!/^\d{6}$/.test(otpInput)) {
      setStatus({ type: 'error', message: 'OTP must be a 6-digit number.' })
      return
    }

    try {
      const result = await verifyRmpOtp({ registrationId, email, otp: otpInput })
      sessionStorage.setItem('mmc_verified_doctor', JSON.stringify(result.doctor))
      setLoginAttempts(0)
      setOtpRequested(false)
      setOtpInput('')
      setCaptchaCode(createCaptcha())
      setCaptchaInput('')
      navigate('/rmp-profile', { state: { doctor: result.doctor } })
    } catch (error) {
      if (!increaseFailedAttempts()) {
        setStatus({ type: 'error', message: error.message })
      }
    }
  }

  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[760px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">RMP Login</h1>

          <div className="grid gap-4">
            <label className="text-sm font-semibold text-[#2E2A21] sm:text-base" htmlFor="registration-id">Registration ID</label>
            <input id="registration-id" type="text" value={registrationId} onChange={(event) => setRegistrationId(event.target.value)} placeholder="Enter registration ID" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:text-base" />

            <label className="text-sm font-semibold text-[#2E2A21] sm:text-base" htmlFor="registered-email">Registered Email</label>
            <input id="registered-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter registered email" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:text-base" />

            <div className="flex flex-col gap-2 rounded-md border border-[#E6E2D8] bg-[#FCFAF4] p-3">
              <p className="text-xs font-semibold text-[#6D6450] sm:text-sm">Captcha Verification</p>
              <div className="flex flex-wrap items-center gap-2">
                <div className="select-none rounded bg-[#2E2A21] px-3 py-2 font-mono text-base tracking-[0.2em] text-white">{captchaCode}</div>
                <button type="button" onClick={() => setCaptchaCode(createCaptcha())} className="rounded border border-[#886718] px-3 py-2 text-xs font-semibold text-[#886718] hover:bg-[#F3ECD8] sm:text-sm">Refresh Captcha</button>
              </div>
              <input type="text" value={captchaInput} onChange={(event) => setCaptchaInput(event.target.value.toUpperCase())} placeholder="Enter captcha" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm uppercase outline-none focus:border-[#886718] sm:text-base" />
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input type="text" value={otpInput} onChange={(event) => setOtpInput(event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))} placeholder="Enter 6-digit OTP" className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:text-base" />
              <button type="button" onClick={handleSendOtp} disabled={sendingOtp || lockoutLeft > 0} className="rounded-md bg-[#886718] px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60">
                {sendingOtp ? 'Sending OTP...' : 'Verify Captcha & Send OTP'}
              </button>
            </div>

            <button type="button" onClick={handleVerify} disabled={lockoutLeft > 0} className="rounded-md bg-[#2E2A21] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f1d17] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base">Verify OTP & Open Profile</button>

            {status.message && (
              <div className={`rounded-md border px-4 py-3 text-sm font-medium ${status.type === 'success' ? 'border-[#3D7A4B] bg-[#ECF8EF] text-[#2D5C38]' : 'border-[#A94D4D] bg-[#FFF3F3] text-[#7A2C2C]'}`}>
                {status.message}
              </div>
            )}

            <div className="rounded-md border border-[#E6E2D8] bg-[#FCFAF4] p-3 text-xs text-[#6D6450] sm:text-sm">
              Security: ID+Email must match backend doctor records, captcha required, OTP checked server-side, OTP is stored hashed, and repeated failures trigger lockout.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default RMPLogin
