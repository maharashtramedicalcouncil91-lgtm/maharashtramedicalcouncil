import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

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
      <div className="mx-auto max-w-[920px] rounded-lg bg-white p-6 sm:p-7 lg:p-10">
        <div className="flex flex-col gap-5">
          <div className="rounded-md border border-[#E6E2D8] bg-[#F3ECD8] px-4 py-3">
            <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">Doctor Profile</h1>
            <p className="text-xs text-[#5C5543] sm:text-sm">Verified profile details from RMP login</p>
          </div>

          <article className="rounded-lg border border-[#D8D0BF] bg-[#FCFAF4] p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              <img
                src={doctor.photo || 'https://via.placeholder.com/120x120.png?text=Doctor'}
                alt={doctor.name}
                className="h-32 w-32 rounded-md border border-[#E6E2D8] object-cover sm:h-36 sm:w-36"
              />
              <div className="grid flex-1 grid-cols-1 gap-2 text-sm text-[#2E2A21] sm:grid-cols-2 sm:gap-3 sm:text-base">
                <p><strong className="text-[#6D6450]">Name:</strong> {doctor.name}</p>
                {doctor.fatherName && <p><strong className="text-[#6D6450]">Father Name:</strong> {doctor.fatherName}</p>}
                <p><strong className="text-[#6D6450]">Registration ID:</strong> {doctor.registrationId}</p>
                {doctor.nationality && <p><strong className="text-[#6D6450]">Nationality:</strong> {doctor.nationality}</p>}
                {doctor.dob && <p><strong className="text-[#6D6450]">DOB:</strong> {doctor.dob}</p>}
                {doctor.validUpto && <p><strong className="text-[#6D6450]">Valid Upto:</strong> {doctor.validUpto}</p>}
                {doctor.ugUniversity && <p><strong className="text-[#6D6450]">UG University:</strong> {doctor.ugUniversity}</p>}
                {doctor.pgUniversity && <p><strong className="text-[#6D6450]">PG University:</strong> {doctor.pgUniversity}</p>}
                <p><strong className="text-[#6D6450]">Degree:</strong> {doctor.degree}</p>
                <p><strong className="text-[#6D6450]">Email:</strong> {doctor.email}</p>
                {doctor.specialization && <p><strong className="text-[#6D6450]">Specialization:</strong> {doctor.specialization}</p>}
                {doctor.phone && <p><strong className="text-[#6D6450]">Phone:</strong> {doctor.phone}</p>}
                {doctor.practiceAddress && <p className="sm:col-span-2"><strong className="text-[#6D6450]">Address:</strong> {doctor.practiceAddress}</p>}
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
