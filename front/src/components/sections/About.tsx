import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '../../hooks/useIsMobile'
import {
  Section,
  Container,
  Stack,
  Heading,
  Text,
  Label,
  Button,
  Divider,
  useScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '../../design-system'

// Pillow data - positions on the sofa
const PILLOWS = [
  { id: 1, color: '#d4af37', finalX: '12%', finalY: '52%', rotation: -8, size: 'lg' },
  { id: 2, color: '#8b7355', finalX: '22%', finalY: '50%', rotation: 5, size: 'md' },
  { id: 3, color: '#f5f5dc', finalX: '32%', finalY: '51%', rotation: -3, size: 'lg' },
  { id: 4, color: '#c9b896', finalX: '42%', finalY: '49%', rotation: 7, size: 'sm' },
  { id: 5, color: '#d4af37', finalX: '52%', finalY: '52%', rotation: -5, size: 'md' },
  { id: 6, color: '#8b7355', finalX: '62%', finalY: '50%', rotation: 4, size: 'lg' },
]

// Falling Pillow Component
function FallingPillow({
  pillow,
  scrollProgress,
  index
}: {
  pillow: typeof PILLOWS[0]
  scrollProgress: any
  index: number
}) {
  const delay = index * 0.08
  const startOffset = 0.1 + delay
  const endOffset = startOffset + 0.25

  // Y position - falls from top to final position
  const y = useTransform(
    scrollProgress,
    [startOffset, endOffset],
    ['-400px', '0px']
  )

  // Opacity
  const opacity = useTransform(
    scrollProgress,
    [startOffset, startOffset + 0.05, endOffset],
    [0, 1, 1]
  )

  // Rotation - slight wobble while falling
  const rotate = useTransform(
    scrollProgress,
    [startOffset, startOffset + 0.1, endOffset - 0.05, endOffset],
    [pillow.rotation - 20, pillow.rotation + 10, pillow.rotation - 5, pillow.rotation]
  )

  // Scale - slight bounce effect
  const scale = useTransform(
    scrollProgress,
    [startOffset, endOffset - 0.05, endOffset],
    [0.8, 1.1, 1]
  )

  const sizeClasses = {
    sm: 'w-16 h-12 md:w-20 md:h-16',
    md: 'w-20 h-14 md:w-24 md:h-18',
    lg: 'w-24 h-16 md:w-28 md:h-20',
  }

  return (
    <motion.div
      className="absolute"
      style={{
        left: pillow.finalX,
        top: pillow.finalY,
        y,
        opacity,
        rotate,
        scale,
        zIndex: 10 + index,
      }}
    >
      {/* Pillow shape */}
      <div
        className={`${sizeClasses[pillow.size as keyof typeof sizeClasses]} rounded-2xl shadow-2xl relative`}
        style={{
          backgroundColor: pillow.color,
          boxShadow: `0 10px 30px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.2)`,
        }}
      >
        {/* Pillow texture/detail */}
        <div className="absolute inset-2 rounded-xl border border-white/10" />
        {/* Pillow highlight */}
        <div
          className="absolute top-1 left-1 right-1/2 bottom-1/2 rounded-tl-xl opacity-20"
          style={{ background: 'linear-gradient(135deg, white 0%, transparent 60%)' }}
        />
      </div>
    </motion.div>
  )
}

// Living room background image
const SOFA_BG = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80'

export default function About() {
  const { t } = useTranslation('ui')
  const isMobile = useIsMobile()
  const sectionRef = useRef<HTMLDivElement>(null)
  const { ref, isInView } = useScrollReveal()

  const stats = [
    { number: '150+', label: t('about.stats.projects') },
    { number: '12', label: t('about.stats.years') },
    { number: '98%', label: t('about.stats.satisfaction') },
    { number: '25+', label: t('about.stats.awards') },
  ]

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [50, -50])
  const textY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [30, -30])

  return (
    <div ref={sectionRef}>
      <Section background="default" className="relative overflow-hidden">
        {/* Sofa Background with Pillows */}
        <div className="absolute inset-0 z-0">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${SOFA_BG})`,
              filter: 'brightness(0.3)',
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/30 to-black/10" />

          {/* Falling Pillows - hide on mobile for performance */}
          {!isMobile && (
            <div className="absolute inset-0">
              {PILLOWS.map((pillow, index) => (
                <FallingPillow
                  key={pillow.id}
                  pillow={pillow}
                  scrollProgress={scrollYProgress}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <Container className="relative z-10">
          <div ref={ref} className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center min-h-[60vh] sm:min-h-[80vh] py-12 sm:py-16 lg:py-20">
            {/* Left side - Empty space for sofa visual */}
            <motion.div
              style={{ y: imageY }}
              className="relative order-2 lg:order-1 hidden lg:block"
            >
              {/* Decorative frame */}
              <div className="aspect-[4/3] relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 border border-gold/20 rounded-lg"
                />

                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute -right-4 md:-right-8 bottom-12 bg-gold text-dark-900 p-6 md:p-8"
                >
                  <p className="text-4xl md:text-5xl font-light">12+</p>
                  <p className="text-xs tracking-wider uppercase mt-1">{t('about.yearsLabel')}</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div
              style={{ y: textY }}
              className="order-1 lg:order-2"
            >
              <Stack gap="lg">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <Label color="accent">{t('about.label')}</Label>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Heading level={2} size="heading-1">
                    {t('about.title1')}
                  </Heading>
                  <Heading level={2} size="heading-1" className="italic font-extralight">
                    {t('about.title2')}
                  </Heading>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Text size="lg" color="muted">
                    {t('about.description1')}
                  </Text>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Text size="lg" color="muted">
                    {t('about.description2')}
                  </Text>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Button variant="ghost" to="/about" className="group inline-flex items-center gap-4 px-0">
                    <span>{t('buttons.learnMore')}</span>
                    <motion.span
                      className="w-12 h-[1px] bg-foreground group-hover:bg-gold group-hover:w-20 transition-all duration-300"
                    />
                  </Button>
                </motion.div>
              </Stack>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="mt-8 sm:mt-12 lg:mt-16 pt-8 sm:pt-12 lg:pt-16 relative z-20">
            <Divider variant="gold" className="mb-8 sm:mb-12 lg:mb-16" />

            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {stats.map((stat) => (
                <StaggerItem key={stat.label} className="text-center">
                  <Text size="lg" color="accent" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-1 sm:mb-2">
                    {stat.number}
                  </Text>
                  <Text size="xs" color="muted" className="tracking-wider uppercase text-[9px] sm:text-[10px] md:text-xs">
                    {stat.label}
                  </Text>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </Section>
    </div>
  )
}
