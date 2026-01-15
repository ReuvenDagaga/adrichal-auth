import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { projects } from '../../data/projects'
import { useIsMobile } from '../../hooks/useIsMobile'
import {
  Section,
  Container,
  Heading,
  Text,
  Label,
  Divider,
  useScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '../../design-system'

// Living room background image URL (elegant dark living room)
const LIVING_ROOM_BG = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop'

export default function ProjectsShowcase() {
  const { t } = useTranslation('ui')
  const isMobile = useIsMobile()
  const [, setHoveredProject] = useState<string | null>(null)
  const { ref, isInView } = useScrollReveal()

  return (
    <Section
      background="default"
      className="relative overflow-hidden min-h-screen"
    >
      {/* Dark living room background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${LIVING_ROOM_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5)',
        }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-[1] bg-black"
        style={{
          opacity: 0.5,
        }}
      />

      <Container className="relative z-10">
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-8 lg:gap-16 min-h-[70vh] lg:min-h-[80vh] items-start py-8 lg:py-16`}>

          {/* Left side - Projects List */}
          <div className="order-2 lg:order-1">
            {/* Section Header */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <Label color="accent" className="mb-4 block">{t('projectsShowcase.label')}</Label>
              <Heading level={2} size="heading-1">
                {t('projectsShowcase.title1')}
              </Heading>
              <Heading level={2} size="heading-1" className="italic font-extralight">
                {t('projectsShowcase.title2')}
              </Heading>
            </motion.div>

            {/* Projects List */}
            <StaggerContainer className="space-y-0">
              {projects.slice(0, 4).map((project, index) => (
                <StaggerItem key={project.id}>
                  <Link
                    to={`/projects/${project.id}`}
                    className="group block py-6 border-t border-white/10 hover:border-gold/50 transition-all duration-500"
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <Text size="xs" color="accent" className="opacity-40 tracking-wider">
                          {String(index + 1).padStart(2, '0')}
                        </Text>
                        <div>
                          <Heading
                            level={3}
                            size="heading-3"
                            className="group-hover:text-gold transition-colors duration-500"
                          >
                            {project.title}
                          </Heading>
                          <Text size="xs" color="subtle" className="tracking-wider uppercase mt-1">
                            {project.category}
                          </Text>
                        </div>
                      </div>

                      <motion.span
                        className="text-gold text-lg opacity-0 group-hover:opacity-100 transition-all duration-500"
                      >
                        →
                      </motion.span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* View All Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8"
            >
              <Link
                to="/projects"
                className="group inline-flex items-center gap-4 text-foreground-subtle hover:text-gold transition-colors duration-500"
              >
                <Text size="xs" className="tracking-widest uppercase">{t('projectsShowcase.viewAll')}</Text>
                <motion.span
                  className="inline-block text-lg"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>

          {/* Right side - Featured Image */}
          <div className={`${isMobile ? 'order-1' : 'order-1 lg:order-2'} relative lg:sticky lg:top-8 self-start flex items-start justify-center`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative w-full h-[300px] lg:h-[500px] rounded-lg overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop"
                alt="Interior Design"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <Text size="sm" color="accent" className="tracking-[0.3em] uppercase">
                  {t('projectsShowcase.featuredWork')}
                </Text>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="mt-16 relative z-10">
          <Divider variant="gold" />
        </div>
      </Container>
    </Section>
  )
}
