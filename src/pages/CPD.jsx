import { ListChecks, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const onlineApplications = [
  {
    title: 'CPD Event Accreditation Form',
    details: 'Apply for accreditation of workshops, conferences, and training events.',
  },
  {
    title: 'Accredited Speaker Request',
    details: 'Submit speaker profile, qualifications, and teaching history for review.',
  },
  {
    title: 'Speciality Speaker Application',
    details: 'Apply under speciality category with supporting department documents.',
  },
  {
    title: 'Credit Points Claim Form',
    details: 'Upload participation details to request CPD credit points.',
  },
  {
    title: 'Observer Accreditation Request',
    details: 'For institutions requesting accredited observer status for CPD sessions.',
  },
  {
    title: 'Rejected Application Compliance',
    details: 'Resubmit corrected documents for previously rejected applications.',
  },
]

const publishedLists = [
  {
    title: 'Accredited Organizations',
    details: 'Current approved organizations authorized for CPD activities.',
  },
  {
    title: 'Partially Accredited Organizations',
    details: 'Organizations with conditional/partial accreditation status.',
  },
  {
    title: 'Case-to-Case Accredited Organizations',
    details: 'Event-wise approved institutions under case-by-case assessment.',
  },
  {
    title: 'Accredited Speaker List',
    details: 'Recognized speakers eligible for CPD programs.',
  },
  {
    title: 'Speciality Speaker List',
    details: 'Approved speciality speakers and areas of expertise.',
  },
  {
    title: 'Current CPD Programs',
    details: 'Active CPD events and session schedules.',
  },
  {
    title: 'Current Webinar Programs',
    details: 'Live and upcoming webinar sessions under MMC CPD.',
  },
]

const Cpd = () => {
  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[1200px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
        <div className="flex flex-col gap-6">
          <section className="rounded-md border border-[#E6E2D8] bg-[#F3ECD8] px-4 py-4 sm:px-5">
            <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">Continuing Professional Development (CPD)</h1>
            <p className="pt-2 text-sm text-[#5C5543] sm:text-base">
              Modern access point for MMC CPD workflows, instructions, and official lists.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-4 sm:p-5">
              <div className="flex items-center gap-2 pb-3">
                <Users size={18} className="text-[#6F5312]" />
                <h2 className="text-lg font-semibold text-[#2E2A21]">Online Applications</h2>
              </div>
              <div className="flex flex-col gap-2">
                {onlineApplications.map((item) => (
                  <Link
                    key={item.title}
                    to={`/cpd/maintenance?item=${encodeURIComponent(item.title)}`}
                    className="rounded-md bg-white px-3 py-2.5 ring-1 ring-[#E6E2D8] transition-colors hover:bg-[#F3ECD8]"
                  >
                    <p className="text-sm font-semibold text-[#2E2A21] sm:text-base">{item.title}</p>
                    <p className="pt-0.5 text-xs text-[#6D6450] sm:text-sm">{item.details}</p>
                  </Link>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-4 sm:p-5">
              <div className="flex items-center gap-2 pb-3">
                <ListChecks size={18} className="text-[#6F5312]" />
                <h2 className="text-lg font-semibold text-[#2E2A21]">Published Lists</h2>
              </div>
              <div className="flex flex-col gap-2">
                {publishedLists.map((item) => (
                  <Link
                    key={item.title}
                    to={`/cpd/maintenance?item=${encodeURIComponent(item.title)}`}
                    className="rounded-md bg-white px-3 py-2.5 ring-1 ring-[#E6E2D8] transition-colors hover:bg-[#F3ECD8]"
                  >
                    <p className="text-sm font-semibold text-[#2E2A21] sm:text-base">{item.title}</p>
                    <p className="pt-0.5 text-xs text-[#6D6450] sm:text-sm">{item.details}</p>
                  </Link>
                ))}
              </div>
            </article>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Cpd
