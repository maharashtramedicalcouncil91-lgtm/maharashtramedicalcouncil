import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldAlert, Wrench } from 'lucide-react'

const CPDMaintenance = () => {
  const location = useLocation()

  const itemName = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('item') || 'This CPD section'
  }, [location.search])

  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[980px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
        <section className="overflow-hidden rounded-2xl border border-[#E6E2D8] bg-gradient-to-br from-[#F8F3E5] via-[#FFFDF8] to-[#F1F5FB] p-6 sm:p-8">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#F3ECD8] px-3 py-1 text-xs font-semibold text-[#6F5312] sm:text-sm">
                <ShieldAlert size={14} />
                CPD Service Update
              </p>
              <h1 className="pt-3 text-2xl font-bold text-[#2E2A21] sm:text-3xl">Under Maintenance</h1>
              <p className="pt-2 text-sm text-[#5C5543] sm:text-base">
                <strong>{itemName}</strong> is temporarily unavailable while we improve the service.
              </p>
              <p className="pt-2 text-sm text-[#5C5543] sm:text-base">
                Please check again shortly. We regret the inconvenience.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/cpd"
                  className="rounded-md bg-[#886718] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#6F5312] sm:text-base"
                >
                  Back to CPD
                </Link>
                <Link
                  to="/online-cpd-platform"
                  className="rounded-md border border-[#886718] bg-white px-4 py-2 text-sm font-semibold text-[#886718] transition-colors hover:bg-[#F3ECD8] sm:text-base"
                >
                  Open Online CPD Platform
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-[#E6E2D8] bg-white p-4">
              <svg viewBox="0 0 320 240" className="h-auto w-full">
                <defs>
                  <linearGradient id="cpdMaintGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#3D5A99" />
                    <stop offset="100%" stopColor="#7AA6D9" />
                  </linearGradient>
                </defs>
                <rect x="20" y="26" width="280" height="188" rx="18" fill="#F6F8FC" stroke="#E4E9F4" />
                <circle cx="92" cy="120" r="46" fill="url(#cpdMaintGrad)" opacity="0.15" />
                <circle cx="230" cy="118" r="58" fill="#EADFC8" opacity="0.55" />
                <rect x="66" y="84" width="188" height="14" rx="7" fill="#D2DBEC" />
                <rect x="66" y="108" width="132" height="12" rx="6" fill="#E5EAF4" />
                <rect x="66" y="128" width="170" height="12" rx="6" fill="#E5EAF4" />
                <rect x="66" y="148" width="110" height="12" rx="6" fill="#E5EAF4" />
              </svg>
              <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#F3ECD8] px-3 py-1.5 text-sm font-semibold text-[#6F5312]">
                <Wrench size={16} />
                Platform maintenance in progress
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default CPDMaintenance
