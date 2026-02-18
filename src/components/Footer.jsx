import { Link } from 'react-router-dom'
import InstagramIcon from '/src/assets/images/logos/InstagramIcon.svg'
import FacebookIcon from '/src/assets/images/logos/FacebookIcon.svg'
import XIcon from '/src/assets/images/logos/XIcon.svg'
import YoutubeIcon from '/src/assets/images/logos/YoutubeIcon.svg'

const Footer = () => {
  return (
    <footer className="bg-[#1A1915] px-4 pt-8 sm:px-6 lg:px-10 lg:pt-10">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 lg:gap-x-6">
        <Link to="/admin" className="text-sm font-semibold text-[#D1B25E] transition-colors duration-300 hover:text-[#886718] lg:text-base">
          Admin Login
        </Link>
        <Link to="/disclaimer" className="text-sm font-semibold text-[#D1B25E] transition-colors duration-300 hover:text-[#886718] lg:text-base">
          Disclaimer
        </Link>
        <Link to="/important-links" className="text-sm font-semibold text-[#D1B25E] transition-colors duration-300 hover:text-[#886718] lg:text-base">
          Important Links
        </Link>
        <Link to="/terms-conditions" className="text-sm font-semibold text-[#D1B25E] transition-colors duration-300 hover:text-[#886718] lg:text-base">
          Terms & Conditions
        </Link>
      </div>

      <div className="flex flex-col justify-between gap-8 pt-6 lg:flex-row lg:pt-10">
        <div>
          <h2 className="text-base font-semibold text-[#EDE9DD] lg:text-lg">
            Follow Maharashtra Medical Council on Social Media
          </h2>
          <div className="flex gap-4 pt-3 lg:gap-5 lg:pt-6">
            <a href="https://www.instagram.com/maharashtramedicalcouncil" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src={InstagramIcon} alt="Instagram" className="h-6 w-6 object-contain" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61576475698311" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src={FacebookIcon} alt="Facebook" className="h-6 w-6 object-contain" />
            </a>
            <a href="https://x.com/MMC_Maharashtra" target="_blank" rel="noopener noreferrer" aria-label="X">
              <img src={XIcon} alt="X" className="h-6 w-6 object-contain" />
            </a>
            <a href="https://www.youtube.com/@MaharashtraMedicalCouncil_MMC" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <img src={YoutubeIcon} alt="YouTube" className="h-6 w-6 object-contain" />
            </a>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-[#EDE9DD] lg:text-lg">MMC Office Mail</h2>
            <a
              href="mailto:maharashtramcouncil@gmail.com"
              className="break-all text-sm text-[#CFC8B6] transition-colors duration-300 hover:text-[#D1B25E] lg:text-base"
            >
              maharashtramcouncil@gmail.com
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-[#EDE9DD] lg:text-lg">MMC Office Helpline</h2>
            <p className="text-sm text-[#CFC8B6] lg:text-base">020 48556211</p>
            <a
              href="mailto:mmconlineservices1@gmail.com"
              className="break-all text-sm text-[#CFC8B6] transition-colors duration-300 hover:text-[#D1B25E] lg:text-base"
            >
              mmconlineservices1@gmail.com
            </a>
          </div>
        </div>
      </div>

      <p className="py-6 text-center text-xs text-[#CFC8B6] sm:text-sm">
        © Copyright MMC, Mumbai All Rights Reserved
      </p>
    </footer>
  )
}

export default Footer
