import { UserCheck, IdCard, GraduationCap, RefreshCcw, Users, MonitorPlay } from 'lucide-react'
import { useSiteContent } from '../context/siteContentStore'

const iconMap = {
  UserCheck,
  IdCard,
  GraduationCap,
  RefreshCcw,
  Users,
  MonitorPlay,
}

const InfoCards = () => {
  const { siteContent } = useSiteContent()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-3">
      {siteContent.infoCards.map((item) => {
        const Icon = iconMap[item.icon] || UserCheck

        return (
          <div key={item.title} className="rounded-lg bg-white px-4 py-5">
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0E4F5C10] sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                <Icon className="h-5 w-5 text-[#0E4F5C] sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
              </div>

              <h2 className="text-lg font-semibold text-[#2E2A21] lg:text-xl">{Number(item.number || 0).toLocaleString('en-IN')}</h2>

              <p className="text-center text-sm text-[#7A7464] sm:text-[15px] lg:text-sm xl:text-[15px]">{item.title}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default InfoCards
