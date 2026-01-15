import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi'
import { useIsMobile } from '../../hooks/useIsMobile'
import {
  Section,
  Container,
  Stack,
  Heading,
  Text,
  Label,
  Button,
  Input,
  Textarea,
  AmbientLight,
  useScrollReveal,
} from '../../design-system'

const WHATSAPP_NUMBER = '972532813811'

export default function Contact() {
  const { t } = useTranslation('ui')
  const isMobile = useIsMobile()
  const { ref, isInView } = useScrollReveal()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const contactInfo = [
    {
      icon: HiOutlineMail,
      label: t('contact.info.email'),
      value: 'theoffice.ad.studio@gmail.com',
      href: 'mailto:theoffice.ad.studio@gmail.com',
    },
    {
      icon: HiOutlinePhone,
      label: t('contact.info.phone'),
      value: '0532813811',
      href: 'tel:0532813811',
    },
    {
      icon: HiOutlineLocationMarker,
      label: t('contact.info.studio'),
      value: t('contact.studioAddress'),
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const message = `**

*${t('contact.whatsapp.name')}:* ${formData.name}
*${t('contact.whatsapp.email')}:* ${formData.email}
*${t('contact.whatsapp.phone')}:* ${formData.phone || t('contact.whatsapp.notSpecified')}

*${t('contact.whatsapp.message')}:*
${formData.message}`

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')

    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Section background="elevated" className="relative overflow-hidden">
      {/* Background Image with grayscale to color effect - hide on mobile */}
      {!isMobile && (
        <div className="absolute inset-0 z-0 group">
          <img
            src="/avigail.png"
            alt=""
            className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-auto max-w-[50%] object-contain opacity-20 grayscale hover:grayscale-0 hover:opacity-40 transition-all duration-700 ease-in-out"
          />
        </div>
      )}

      {/* Ambient lighting effects - reduce on mobile */}
      {!isMobile && (
        <>
          <AmbientLight color="gold" intensity="medium" size="xl" position="top-center" />
          <AmbientLight color="gold" intensity="subtle" size="md" position="bottom-left" />
          <AmbientLight color="white" intensity="subtle" size="sm" position="center-right" />
        </>
      )}

      <Container className="relative z-10">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24">
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 20 : 0 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Stack gap="lg">
              <Label color="accent">{t('contact.label')}</Label>

              <Heading level={2} size="heading-1">
                {t('contact.title1')}
              </Heading>
              <Heading level={2} size="heading-1" className="italic font-extralight">
                {t('contact.title2')}
              </Heading>

              <Text size="lg" color="muted" className="max-w-md">
                {t('contact.description')}
              </Text>

              {/* Contact Info */}
              <Stack gap="md" className="mt-4">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 sm:gap-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 border border-border-accent flex items-center justify-center text-gold flex-shrink-0">
                      <item.icon size={isMobile ? 18 : 20} />
                    </div>
                    <div className="min-w-0">
                      <Label color="muted" className="mb-1 block text-xs">{item.label}</Label>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-foreground hover:text-gold transition-colors duration-300 text-sm sm:text-base break-all"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <Text className="text-sm sm:text-base">{item.value}</Text>
                      )}
                    </div>
                  </div>
                ))}
              </Stack>
            </Stack>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 20 : 0 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, delay: isMobile ? 0 : 0.2 }}
          >
            <form onSubmit={handleSubmit}>
              <Stack gap={isMobile ? "md" : "lg"}>
                <Input
                  label={t('form.labels.name')}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('form.placeholders.name')}
                  required
                />

                <Input
                  label={t('form.labels.email')}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('form.placeholders.email')}
                  required
                />

                <Input
                  label={t('form.labels.phone')}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('form.placeholders.phone')}
                />

                <Textarea
                  label={t('form.labels.message')}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('form.placeholders.message')}
                  rows={4}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                >
                  {t('buttons.sendMessage')}
                </Button>
              </Stack>
            </form>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}
