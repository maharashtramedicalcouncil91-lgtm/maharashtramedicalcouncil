import { BellRing, BookOpenText, ExternalLink, Globe } from 'lucide-react'

const cpdLinks = [
  {
    title: 'Notification',
    description: 'Official MMC CPD notification document (PDF).',
    href: 'https://www.maharashtramedicalcouncil.in/NotificationCPD.pdf',
    icon: BellRing,
    tone: 'bg-[#E94B3C] hover:bg-[#D53E30]',
  },
  {
    title: 'User Manual',
    description: 'Step-by-step guide for doctors and organizers (PDF).',
    href: 'https://www.maharashtramedicalcouncil.in/User_Manual_MahaCPD.pdf',
    icon: BookOpenText,
    tone: 'bg-[#405FA3] hover:bg-[#334E88]',
  },
  {
    title: 'Platform Link',
    description: 'Open the MahaCPD portal to login and use the platform.',
    href: 'https://www.mahacpd.com/auth',
    icon: Globe,
    tone: 'bg-[#4F9ED9] hover:bg-[#3F89BE]',
  },
]

const OnlineCPDPlatform = () => {
  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[1100px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
        <section className="rounded-2xl border border-[#E6E2D8] bg-gradient-to-br from-[#F8F3E5] via-[#F7F2E8] to-[#EEF4FA] p-6 sm:p-8">
          <h1 className="text-center text-3xl font-extrabold leading-tight text-[#1F2C7C] sm:text-4xl">
            Maharashtra Medical Council
          </h1>
          <h2 className="pt-2 text-center text-2xl font-bold leading-tight text-[#D88A14] sm:text-4xl">
            Continuing Professional Development
          </h2>
        </section>

        <section className="mt-6 rounded-2xl border border-[#E6E2D8] bg-[#FCFAF4] p-5 sm:p-6">
          <h3 className="text-center text-2xl font-bold text-[#222831] sm:text-3xl">Online CPD Platform MahaCPD</h3>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:gap-4">
            {cpdLinks.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between rounded-xl px-4 py-4 text-white transition-colors sm:px-5 ${item.tone}`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon size={20} />
                    <div className="min-w-0">
                      <p className="text-base font-semibold sm:text-lg">{item.title}</p>
                      <p className="truncate text-xs text-white/90 sm:text-sm">{item.description}</p>
                    </div>
                  </div>
                  <ExternalLink size={18} className="shrink-0 opacity-90 transition-transform group-hover:translate-x-0.5" />
                </a>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

export default OnlineCPDPlatform
