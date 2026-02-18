import { useNavigate } from 'react-router-dom'
import { useSiteContent } from '../context/siteContentStore'
import NewButton from './NewButton'

const buttonClass =
  'w-full rounded-md bg-[#886718] px-4 py-2.5 text-center text-sm font-semibold leading-snug text-white whitespace-normal break-words transition-colors duration-300 hover:bg-[#6F5312] sm:px-5 sm:text-sm lg:text-[15px]'

const isExternal = (path) => /^https?:\/\//i.test(path)

const NoticeBoard = () => {
  const { siteContent } = useSiteContent()
  const navigate = useNavigate()

  const { board, leftButtons, rightButtons } = siteContent.noticeBoard

  const handleButtonClick = (button) => {
    const isAdministratorButton = button.name === 'MMC Administrator'
    const isCpdButton = button.name === 'CPD'
    const isOnlineCpdButton = button.name === 'Online CPD Platform'
    const isRegisterButton = button.name === 'Register'
    const isFeedbackButton = button.name === 'Feedback'
    const isRmpInformationButton = button.name === 'RMP Information'
    const isOnlinePaymentButton = button.name === 'Online Payment'
    const isComplaintButton = button.name === 'Complaint'
    const isIdCardPrintButton = button.name === 'ID Card Print'
    const isCcmpRegistrationButton = button.name === 'CCMP Registration'
    const isIdCardOrderButton = button.name === 'ID Card Order'
    const path = isAdministratorButton && (!button.path || button.path === '/')
      ? '/administrator'
      : isCpdButton && (!button.path || button.path === '/')
      ? '/cpd'
      : isOnlineCpdButton
        ? '/online-cpd-platform'
        : isRegisterButton && (!button.path || button.path === '/')
          ? 'https://www.maharashtramedicalcouncil.in/Files/Register_04082023_Maharashtra%20Medical%20Register%20-2022.pdf'
          : isFeedbackButton && (!button.path || button.path === '/')
            ? '/feedback'
            : isRmpInformationButton && (!button.path || button.path === '/')
              ? '/rmp-information'
              : isOnlinePaymentButton && (!button.path || button.path === '/')
                ? '/online-payment'
              : isComplaintButton && (!button.path || button.path === '/')
                ? '/complaint'
            : isIdCardPrintButton && (!button.path || button.path === '/')
              ? '/id-card-print'
              : isCcmpRegistrationButton && (!button.path || button.path === '/')
                ? '/ccmp-registration'
                : isIdCardOrderButton && (!button.path || button.path === '/')
                  ? '/id-card-order'
        : button.path

    if (!path) {
      return
    }

    if (isExternal(path) || path.includes('/public/')) {
      window.open(path, '_blank', 'noopener,noreferrer')
      return
    }

    navigate(path)
  }

  return (
    <section className="grid gap-4 py-6 lg:grid-cols-[250px_minmax(0,1fr)_250px] lg:gap-5 lg:py-10">
      <div className="rounded-lg bg-white">
        <div className="flex flex-col gap-3 p-4 sm:p-5">
          {leftButtons.map((button) => (
            <button key={button.name} type="button" onClick={() => handleButtonClick(button)} className={buttonClass}>
              {button.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-white">
        <div className="flex flex-col gap-4 p-4 sm:p-6 lg:p-8">
          <h2 className="text-center text-lg font-semibold uppercase text-[#2E2A21] lg:text-xl">Notice Board</h2>
          {board.map((notice) => (
            <a
              key={notice.title}
              href={notice.path}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#2E2A21] transition-colors duration-300 hover:text-[#886718] sm:text-base"
            >
              <NewButton /> {notice.title}
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-white">
        <div className="flex flex-col gap-3 p-4 sm:p-5">
          {rightButtons.map((button) => (
            <button key={button.name} type="button" onClick={() => handleButtonClick(button)} className={buttonClass}>
              {button.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NoticeBoard
