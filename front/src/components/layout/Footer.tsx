import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaInstagram, FaPinterest, FaFacebookF } from 'react-icons/fa'
import {
  Container,
  Stack,
  Heading,
  Text,
  Label,
  AmbientLight,
} from '../../design-system'

const socialLinks = [
  { name: 'Instagram', url: 'https://instagram.com', icon: FaInstagram },
  { name: 'Pinterest', url: 'https://pinterest.com', icon: FaPinterest },
  { name: 'Facebook', url: 'https://facebook.com', icon: FaFacebookF },
]

export default function Footer() {
  const { t } = useTranslation()

  const quickLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.projects'), path: '/projects' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ]

  return (
    <footer className="bg-background-elevated border-t border-border relative overflow-hidden">
      {/* Ambient lighting */}
      <AmbientLight color="gold" intensity="subtle" size="lg" position="top-left" />

      <Container className="relative z-10 py-24 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <Heading level={2} size="heading-3" className="tracking-[0.3em]">
                ADRICHAL
              </Heading>
              <Label color="accent" className="block mt-1 text-[10px] tracking-[0.5em]">
                INTERIOR DESIGN
              </Label>
            </Link>
            <Text size="sm" color="muted" className="max-w-xs">
              {t('footer.tagline')}
            </Text>
          </div>

          {/* Quick Links */}
          <div>
            <Label color="accent" className="block mb-6">{t('footer.navigation')}</Label>
            <Stack gap="sm">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-foreground-muted hover:text-foreground transition-colors duration-300 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </Stack>
          </div>

          {/* Contact */}
          <div>
            <Label color="accent" className="block mb-6">{t('footer.contact')}</Label>
            <Stack gap="sm">
              <a
                href="tel:0532813811"
                className="text-foreground-muted hover:text-foreground transition-colors duration-300 text-sm"
              >
                +972 53 281 3811
              </a>
              <a
                href="mailto:theoffice.ad.studio@gmail.com"
                className="text-foreground-muted hover:text-foreground transition-colors duration-300 text-sm"
              >
                theoffice.ad.studio@gmail.com
              </a>
              <Text size="sm" color="muted">
                {t('contact.info.studio')}: תל אביב
              </Text>
            </Stack>
          </div>

          {/* Social */}
          <div>
            <Label color="accent" className="block mb-6">{t('footer.followUs')}</Label>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 border border-border flex items-center justify-center text-foreground-muted hover:border-gold hover:text-gold transition-colors duration-300"
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <Text size="xs" color="subtle" className="tracking-wider">
            © {new Date().getFullYear()} ADRICHAL. {t('footer.copyright')}
          </Text>
          <div className="flex gap-6 rtl:flex-row-reverse">
            <Link
              to="/privacy"
              className="text-foreground-subtle text-xs hover:text-foreground transition-colors duration-300"
            >
              {t('footer.privacyPolicy')}
            </Link>
            <Link
              to="/terms"
              className="text-foreground-subtle text-xs hover:text-foreground transition-colors duration-300"
            >
              {t('footer.termsOfUse')}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
