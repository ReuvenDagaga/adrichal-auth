import { motion } from 'framer-motion'
import { useIsMobile } from '../../hooks/useIsMobile'
import {
  Section,
  Container,
  Heading,
  Text,
  Label,
  Card,
  AmbientLight,
  useScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '../../design-system'

const services = [
  {
    number: '01',
    title: 'Interior Design',
    description: 'Complete interior design solutions from concept to execution, creating spaces that reflect your unique style.',
  },
  {
    number: '02',
    title: 'Space Planning',
    description: 'Strategic space optimization that maximizes functionality while maintaining aesthetic excellence.',
  },
  {
    number: '03',
    title: 'Furniture Design',
    description: 'Custom furniture pieces designed and crafted to perfectly complement your interior vision.',
  },
  {
    number: '04',
    title: '3D Visualization',
    description: 'Photorealistic 3D renderings that bring your design concepts to life before construction begins.',
  },
]

export default function Services() {
  const isMobile = useIsMobile()
  const { ref, isInView } = useScrollReveal()

  return (
    <Section background="default">
      {/* Ambient lighting effects - reduce on mobile */}
      {!isMobile && (
        <>
          <AmbientLight color="gold" intensity="subtle" size="lg" position="center-right" />
          <AmbientLight color="white" intensity="subtle" size="md" position="bottom-left" />
        </>
      )}

      {/* Decorative Element - hide on mobile */}
      {!isMobile && (
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-gold" />
            <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-gold" />
            <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-gold" />
          </svg>
        </div>
      )}

      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 lg:mb-20 max-w-2xl"
        >
          <Label color="accent" className="mb-3 sm:mb-4 block">What We Do</Label>
          <Heading level={2} size="heading-1">
            Our
          </Heading>
          <Heading level={2} size="heading-1" className="italic font-extralight">
            Services
          </Heading>
        </motion.div>

        {/* Services Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {services.map((service) => (
            <StaggerItem key={service.number}>
              <Card
                variant="interactive"
                padding="lg"
                className="group relative h-full"
              >
                {/* Number */}
                <span className="text-gold/20 text-5xl sm:text-6xl lg:text-8xl font-light absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-8 lg:right-8 group-hover:text-gold/40 transition-colors duration-500">
                  {service.number}
                </span>

                {/* Content */}
                <div className="relative z-10">
                  <Heading level={3} size="heading-3" className="mb-4 group-hover:text-gold transition-colors duration-300">
                    {service.title}
                  </Heading>
                  <Text color="muted">
                    {service.description}
                  </Text>
                </div>

                {/* Hover Line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-gold"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  )
}
