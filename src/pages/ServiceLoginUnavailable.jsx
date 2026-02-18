import { useMemo, useState } from 'react'
import { useSiteContent } from '../context/siteContentStore'

const serviceConfigs = {
  'id-card-order': {
    title: 'ID Card Order',
    reason:
      'This service is temporarily unavailable due to portal maintenance and backend verification upgrade. Please try again later.',
  },
  'ccmp-registration': {
    title: 'CCMP Registration',
    reason:
      'CCMP Registration is currently paused while the new compliance workflow is being rolled out.',
  },
  'id-card-print': {
    title: 'ID Card Print',
    reason:
      'ID Card Print is not available right now because document sync and print queue services are under scheduled maintenance.',
  },
  'rmp-information': {
    title: 'RMP Information',
    reason:
      'RMP Information is temporarily unavailable while records are being synchronized and validated. Please check back shortly.',
  },
}

const normalize = (value) => String(value || '').trim().toLowerCase()

const ServiceLoginUnavailable = ({ serviceKey }) => {
  const { siteContent } = useSiteContent()
  const doctors = siteContent.doctors || []

  const config = useMemo(() => serviceConfigs[serviceKey] || serviceConfigs['id-card-order'], [serviceKey])

  const [registrationId, setRegistrationId] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const showLoginCheck = serviceKey !== 'rmp-information'

  const handleCheck = () => {
    const cleanRegistrationId = registrationId.trim()
    const cleanEmail = normalize(email)

    if (!cleanRegistrationId || !cleanEmail) {
      setStatus({ type: 'error', message: 'Please enter Registration ID and Registered Email.' })
      return
    }

    const match = doctors.find(
      (doctor) =>
        normalize(doctor.registrationId) === normalize(cleanRegistrationId) && normalize(doctor.email) === cleanEmail,
    )

    if (!match) {
      setStatus({
        type: 'error',
        message: 'No registered record found for the provided details. Please use registered credentials only.',
      })
      return
    }

    setStatus({
      type: 'success',
      message: `${config.reason}`,
    })
  }

  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[760px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
        <div className="flex flex-col gap-5">
          <div className="rounded-md border border-[#E6E2D8] bg-[#F3ECD8] px-4 py-4">
            <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">{config.title}</h1>
            <p className="pt-2 text-sm text-[#5C5543] sm:text-base">
              {showLoginCheck
                ? 'Login check for registered users. This is a temporary access screen.'
                : 'This section is temporarily unavailable while records are being synchronized.'}
            </p>
          </div>

          {showLoginCheck ? (
            <div className="grid gap-3">
              <input
                type="text"
                value={registrationId}
                onChange={(event) => setRegistrationId(event.target.value)}
                placeholder="Registration ID"
                className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:text-base"
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Registered Email"
                className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:text-base"
              />
              <button
                type="button"
                onClick={handleCheck}
                className="rounded-md bg-[#886718] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#6F5312] sm:text-base"
              >
                Check Availability
              </button>
            </div>
          ) : (
            <div className="rounded-md border border-[#D8D0BF] bg-[#FCFAF4] px-4 py-4">
              <p className="text-sm text-[#5C5543] sm:text-base">
                We are currently updating and validating the RMP records. The information will be accessible again once
                synchronization is completed.
              </p>
            </div>
          )}

          {status.message && (
            <div
              className={`rounded-md border px-4 py-3 text-sm font-medium sm:text-base ${
                status.type === 'success'
                  ? 'border-[#A9852F] bg-[#FFF8E8] text-[#5D4714]'
                  : 'border-[#A94D4D] bg-[#FFF3F3] text-[#7A2C2C]'
              }`}
            >
              {status.message}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ServiceLoginUnavailable
