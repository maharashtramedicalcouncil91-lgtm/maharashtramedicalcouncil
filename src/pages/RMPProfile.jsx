import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const RECEIPT_STORAGE_KEY = 'mmc_payment_receipt_latest'

const normalizeDateInput = (value) => String(value || '').trim().slice(0, 10)
const parseIsoDate = (value) => {
  const raw = normalizeDateInput(value)
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) {
    return null
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) {
    return null
  }
  return { year, month, day, raw }
}

const formatDateForDisplay = (value) => {
  const parsed = parseIsoDate(value)
  if (!parsed) {
    return String(value || '')
  }
  return `${String(parsed.day).padStart(2, '0')}-${String(parsed.month).padStart(2, '0')}-${parsed.year}`
}

const isProfileExpired = (validUpto) => {
  const parsed = parseIsoDate(validUpto)
  if (!parsed) {
    return false
  }
  const expiryUtcMs = Date.UTC(parsed.year, parsed.month - 1, parsed.day, 23, 59, 59, 999)
  return expiryUtcMs < Date.now()
}

const RMPProfile = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const doctor = useMemo(() => {
    if (location.state?.doctor) {
      return location.state.doctor
    }

    try {
      const saved = sessionStorage.getItem('mmc_verified_doctor')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }, [location.state])

  const paymentReceipt = useMemo(() => {
    if (!doctor) {
      return null
    }

    try {
      const saved = sessionStorage.getItem(RECEIPT_STORAGE_KEY)
      if (!saved) {
        return null
      }

      const parsed = JSON.parse(saved)
      const sameRegistration = String(parsed.registrationId || '').trim() === String(doctor.registrationId || '').trim()
      const sameEmail = String(parsed.email || '').trim().toLowerCase() === String(doctor.email || '').trim().toLowerCase()
      return sameRegistration && sameEmail ? parsed : null
    } catch {
      return null
    }
  }, [doctor])

  const expired = isProfileExpired(doctor?.validUpto)

  const handleBackToLogin = () => {
    navigate('/rmp-login')
  }

  const handleClearSession = () => {
    sessionStorage.removeItem('mmc_verified_doctor')
    navigate('/rmp-login')
  }

  if (!doctor) {
    return (
      <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
        <div className="mx-auto max-w-[880px] rounded-lg bg-white p-6 sm:p-7 lg:p-9">
          <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">Doctor Profile</h1>
          <p className="pt-3 text-sm text-[#5C5543] sm:text-base">
            No verified doctor session found. Please complete RMP login first.
          </p>
          <button
            type="button"
            onClick={handleBackToLogin}
            className="mt-6 rounded-md bg-[#886718] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6F5312] sm:text-base"
          >
            Go to RMP Login
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[980px] rounded-lg bg-white p-6 sm:p-7 lg:p-10">
        <div className="flex flex-col gap-5">
          <div className="rounded-md border border-[#E6E2D8] bg-[#F8F3E5] px-4 py-3">
            <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">RMP Verified Doctor ID</h1>
            <p className="text-xs text-[#5C5543] sm:text-sm">Authenticated profile details from secure RMP login</p>
          </div>

          <article className="overflow-hidden rounded-lg border border-[#CFC6B1] shadow-sm">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#1F2A44] to-[#2D4A7C] px-4 py-3">
              <p className="text-xs font-semibold tracking-[0.12em] text-white sm:text-sm">MAHARASHTRA MEDICAL COUNCIL</p>
              <span className="rounded bg-[#E0C57A] px-2 py-1 text-[10px] font-bold text-[#2E2A21] sm:text-xs">OFFICIAL ID</span>
            </div>

            <div className="bg-[#FCFAF4] p-4 sm:p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                <div className="w-fit rounded-lg border border-[#D8D0BF] bg-white p-2">
                  <img
                    src={doctor.photo || 'https://via.placeholder.com/140x170.png?text=Doctor'}
                    alt={doctor.name}
                    className="h-36 w-28 rounded object-cover sm:h-40 sm:w-32"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-bold text-[#1E1B15] sm:text-xl">{doctor.name}</h2>
                  <p className="text-sm font-semibold text-[#6F5312] sm:text-base">{doctor.degree}</p>
                  <p className="pt-1 text-sm text-[#5C5543]">Registration ID: {doctor.registrationId}</p>
                  <p className={`mt-1 inline-flex w-fit rounded px-2 py-0.5 text-xs font-semibold ${expired ? 'bg-[#FFE5E5] text-[#9A3434]' : 'bg-[#ECF8EF] text-[#2D5C38]'}`}>
                    {expired ? 'ID Status: Expired' : 'ID Status: Active'}
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 rounded-md border border-[#E6E2D8] bg-white p-3 text-sm text-[#2E2A21] sm:grid-cols-2">
                    {doctor.fatherName && <p><strong className="text-[#6D6450]">Father Name:</strong> {doctor.fatherName}</p>}
                    {doctor.nationality && <p><strong className="text-[#6D6450]">Nationality:</strong> {doctor.nationality}</p>}
                    {doctor.dob && <p><strong className="text-[#6D6450]">DOB:</strong> {formatDateForDisplay(doctor.dob)}</p>}
                    {doctor.validUpto && <p><strong className="text-[#6D6450]">Valid Upto:</strong> {formatDateForDisplay(doctor.validUpto)}</p>}
                    <p><strong className="text-[#6D6450]">Email:</strong> {doctor.email}</p>
                    {doctor.phone && <p><strong className="text-[#6D6450]">Phone:</strong> {doctor.phone}</p>}
                    {doctor.specialization && <p><strong className="text-[#6D6450]">Specialization:</strong> {doctor.specialization}</p>}
                    {doctor.ugUniversity && <p className="sm:col-span-2"><strong className="text-[#6D6450]">UG University:</strong> {doctor.ugUniversity}</p>}
                    {doctor.pgUniversity && <p className="sm:col-span-2"><strong className="text-[#6D6450]">PG University:</strong> {doctor.pgUniversity}</p>}
                    {doctor.practiceAddress && <p className="sm:col-span-2"><strong className="text-[#6D6450]">Address:</strong> {doctor.practiceAddress}</p>}
                  </div>

                  {paymentReceipt && (
                    <div className="mt-4 rounded-md border border-[#E6E2D8] bg-[#FFFDF7] p-3 text-sm text-[#2E2A21]">
                      <p className="pb-1 text-xs font-semibold tracking-[0.08em] text-[#6F5312]">LATEST PAYMENT STATUS</p>
                      <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-2 sm:gap-x-4">
                        <p><strong className="text-[#6D6450]">Fee Type:</strong> {paymentReceipt.feeType}</p>
                        <p><strong className="text-[#6D6450]">Amount:</strong> INR {paymentReceipt.amount}</p>
                        <p><strong className="text-[#6D6450]">Payment Method:</strong> {paymentReceipt.mode || 'UPI'}</p>
                        <p><strong className="text-[#6D6450]">Status:</strong> {paymentReceipt.status}</p>
                        {paymentReceipt.utrNo && <p><strong className="text-[#6D6450]">UTR:</strong> {paymentReceipt.utrNo}</p>}
                        <p><strong className="text-[#6D6450]">Updated:</strong> {paymentReceipt.lastUpdated}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="rounded-md border border-[#886718] bg-white px-4 py-2.5 text-sm font-semibold text-[#886718] transition-colors hover:bg-[#F3ECD8] sm:text-base"
            >
              Back to Login
            </button>
            <button
              type="button"
              onClick={handleClearSession}
              className="rounded-md bg-[#2E2A21] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f1d17] sm:text-base"
            >
              Logout Session
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default RMPProfile
