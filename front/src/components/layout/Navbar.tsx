import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'

interface NavbarProps {
  logoSrc?: string
}

export default function Navbar({ logoSrc = '/logo.png' }: NavbarProps) {
  const { t } = useTranslation('ui')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.projects'), path: '/projects' },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.contact'), path: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10'
            : 'bg-black/70 backdrop-blur-lg backdrop-saturate-150 border-b border-white/5'
        }`}
        style={{
          WebkitBackdropFilter: isScrolled ? 'blur(24px) saturate(150%)' : 'blur(16px) saturate(150%)',
        }}
      >
        <div className="flex items-center justify-between h-20 px-4 lg:px-16">
          {/* Logo - Left */}
          <Link to="/" className="flex-shrink-0 mr-auto lg:mr-0">
            <img
              src={logoSrc}
              alt="Logo"
              className="max-h-20 w-auto p-1"
            />
          </Link>

          {/* Navigation Links - Right */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors ${
                  location.pathname === link.path
                    ? 'text-[#c9a227]'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Language Switcher */}
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={`w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        <div className="h-px bg-white/10" />
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#1a1f1a] pt-20 lg:hidden"
          >
            <nav className="flex flex-col items-center gap-6 p-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-xl ${
                    location.pathname === link.path
                      ? 'text-[#c9a227]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Language Switcher in Mobile Menu */}
              <div className="pt-4">
                <LanguageSwitcher />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}
