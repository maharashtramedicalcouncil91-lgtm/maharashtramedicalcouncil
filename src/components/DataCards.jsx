import { useSiteContent } from '../context/siteContentStore'

const normalizeHref = (path) => {
  const value = String(path || '').trim()
  if (!value) {
    return ''
  }

  if (/^(https?:\/\/|mailto:|tel:)/i.test(value)) {
    return value
  }

  if (value.startsWith('/')) {
    return value
  }

  if (value.startsWith('public/')) {
    return `/${value}`
  }

  return `/${value}`
}

const DataCards = () => {
  const { siteContent } = useSiteContent()

  const sections = Object.entries(siteContent.dataCards).map(([title, items]) => ({
    title,
    items,
  }))

  return (
    <section className="grid grid-cols-1 gap-4 lg:my-10 lg:grid-cols-2 xl:grid-cols-4">
      {sections.map((section) => (
        <article key={section.title} className="rounded-lg bg-white p-4">
          <div className="flex flex-col items-center">
            <div className="flex w-full flex-col items-center border-b border-[#D1B25E] bg-[#F3ECD8] p-2">
              <h2 className="text-base font-semibold uppercase text-[#2E2A21]">{section.title}</h2>
            </div>
            <div className="flex flex-col gap-3 p-3">
              {section.items.map((item) => {
                const href = normalizeHref(item.path)

                if (!href) {
                  return (
                    <span key={item.title} className="text-sm font-semibold text-[#A89973] sm:text-base">
                      {item.title} (Link updating)
                    </span>
                  )
                }

                return (
                  <a
                    key={item.title}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#2E2A21] transition-colors duration-300 hover:text-[#886718] sm:text-base"
                  >
                    {item.title}
                  </a>
                )
              })}
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}

export default DataCards
