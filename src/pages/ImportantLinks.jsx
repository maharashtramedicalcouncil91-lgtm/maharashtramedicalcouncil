import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

const governmentLinks = [
  {
    title: 'Government of India',
    description: 'National portal for public services, schemes, and official information.',
    url: 'https://www.india.gov.in',
  },
  {
    title: 'Government of Maharashtra',
    description: 'Official state portal for departments, notifications, and citizen services.',
    url: 'https://www.maharashtra.gov.in',
  },
  {
    title: 'Ministry of Health and Family Welfare',
    description: 'Central health ministry advisories, policies, and public health updates.',
    url: 'https://www.mohfw.gov.in',
  },
  {
    title: 'National Medical Commission (NMC)',
    description: 'Regulatory information for medical education, registration, and standards.',
    url: 'https://www.nmc.org.in',
  },
]

const ImportantLinks = () => {
  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[1200px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
        <div className="flex flex-col gap-6">
          <div className="rounded-md border border-[#E6E2D8] bg-[#F3ECD8] px-4 py-4">
            <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">Important Links</h1>
            <p className="pt-2 text-sm text-[#5C5543] sm:text-base">
              Verified public and regulatory portals relevant to doctors and healthcare administration.
            </p>
          </div>

          <section>
            <h2 className="pb-3 text-lg font-semibold text-[#2E2A21]">Government and Regulatory Portals</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {governmentLinks.map((item) => (
                <article key={item.url} className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-4 sm:p-5">
                  <h3 className="text-base font-semibold text-[#2E2A21] sm:text-lg">{item.title}</h3>
                  <p className="pt-2 text-sm text-[#5C5543] sm:text-base">{item.description}</p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#886718] transition-colors hover:text-[#6F5312] sm:text-base"
                  >
                    Visit Website <ExternalLink size={16} />
                  </a>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default ImportantLinks
