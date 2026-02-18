import Whatsapp from '/src/assets/images/logos/WhatsappIcon.png'

const WhatsApp = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[#FFFFFFE6] px-3 py-1 text-xs font-semibold text-[#2E2A21] shadow-sm backdrop-blur-sm">
          MMC Help Desk
        </span>
        <a href="https://wa.me/919790087107?text=Hi" target="_blank" rel="noopener noreferrer" aria-label="Open WhatsApp Helpdesk">
          <img src={Whatsapp} alt="WhatsApp" className="h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14" />
        </a>
      </div>
    </div>
  )
}

export default WhatsApp
