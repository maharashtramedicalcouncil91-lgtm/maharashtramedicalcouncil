import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import MMCLogo from '../assets/images/logos/MMCLogo.png'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about-us' },
  { label: 'Contact Us', path: '/contact-us' },
  { label: 'RTI', path: '/rti' },
  { label: 'Act & Rules', path: '/act-rules' },
]

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-10 lg:py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-[#2E2A21] hover:bg-[#F3ECD8] lg:hidden"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16">
              <img src={MMCLogo} alt="MMC Logo" className="h-full w-full object-contain" />
            </div>

            <h1 className="max-w-[210px] text-[11px] font-semibold uppercase leading-snug text-[#2E2A21] sm:max-w-none sm:text-base lg:text-xl">
              Maharashtra Medical Council, Mumbai
            </h1>
          </div>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Desktop navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-semibold transition-colors duration-300 xl:text-base ${
                    isActive ? 'text-[#886718]' : 'text-[#2E2A21] hover:text-[#886718]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              to="/rmp-login"
              className="rounded bg-[#886718] px-5 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#6F5312] xl:text-base"
            >
              Login
            </Link>
          </nav>
        </div>

        {isMobileMenuOpen && (
          <nav className="border-t border-[#E6E2D8] bg-[#FCFAF4] px-4 py-3 sm:px-6 lg:hidden" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-300 sm:text-base ${
                      isActive
                        ? 'bg-[#F3ECD8] text-[#886718]'
                        : 'text-[#2E2A21] hover:bg-[#F3ECD8] hover:text-[#886718]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <Link
                to="/admin"
                onClick={handleNavClick}
                className="mt-1 rounded-md bg-[#886718] px-3 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#6F5312] sm:text-base"
              >
                Login
              </Link>
            </div>
          </nav>
        )}
      </header>

      <div className="bg-[#F3ECD8] px-4 py-1 sm:px-6 lg:px-10">
        <h2 className="text-center text-[10px] font-semibold leading-relaxed text-[#2E2A21] sm:text-xs lg:text-sm">
          (Established by Government of Maharashtra under the MMC Act, 1965) ISO 9001:2015 Certified Organization
        </h2>
      </div>
    </>
  )
}

export default Navbar
