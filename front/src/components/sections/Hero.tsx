import { motion } from 'framer-motion'
import HeroScene from '../3d/HeroScene'
import { useIsMobile } from '../../hooks/useIsMobile'
import {
  Section,
  Stack,
  Button,
  Heading,
  Text,
  Label,
  Divider,
} from '../../design-system'

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Hero() {
  const isMobile = useIsMobile()

  return (
    <Section padding="none" className="h-screen">
      {/* 3D Background for desktop, static image for mobile */}
      {isMobile ? (
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
            alt="Interior Design"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ) : (
        <HeroScene />
      )}

      {/* Content Overlay */}
      <div className="absolute inset-y-0 left-0 z-10 pointer-events-none w-full lg:w-3/5 xl:w-1/2">
        {/* Dark gradient background for text readability */}
        <div className={`absolute inset-0 ${
          isMobile
            ? 'bg-black/20'
            : 'bg-gradient-to-r from-black/90 via-black/70 to-transparent'
        }`} />

        <div className="relative h-full flex items-center px-4 sm:px-8 lg:px-20">
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: easeOutExpo }}
            className="max-w-2xl w-full"
          >
            <Stack gap={isMobile ? "sm" : "md"} align="start">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <Label color="accent" className={isMobile ? "text-xs" : ""}>
                  Luxury Interior Design
                </Label>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1, ease: easeOutExpo }}
              >
                <Heading
                  level={1}
                  size={isMobile ? "heading-1" : "display-1"}
                  className={`text-left ${isMobile ? '' : 'whitespace-nowrap'}`}
                >
                  Creating Spaces
                </Heading>
                <Heading
                  level={1}
                  size={isMobile ? "heading-1" : "display-1"}
                  className="text-left italic font-thin text-gradient"
                >
                  That Inspire
                </Heading>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.3 }}
                className={`max-w-lg ${isMobile ? 'mt-1' : 'mt-2'}`}
              >
                <Text
                  size={isMobile ? "base" : "lg"}
                  color="subtle"
                  className="text-left leading-relaxed"
                >
                  We design exceptional interiors that transform the way you live,
                  blending timeless elegance with modern sophistication.
                </Text>
              </motion.div>

              {/* Buttons - pointer-events-auto to make them clickable */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.6 }}
                className={`pointer-events-auto ${isMobile ? 'mt-4' : 'mt-8'} w-full sm:w-auto`}
              >
                <Stack
                  direction="horizontal"
                  gap={isMobile ? "sm" : "md"}
                  className="flex-col sm:flex-row w-full sm:w-auto"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    to="/projects"
                    className={isMobile ? "w-full sm:w-auto" : ""}
                  >
                    View Projects
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    to="/contact"
                    className={isMobile ? "w-full sm:w-auto" : ""}
                  >
                    Get in Touch
                  </Button>
                </Stack>
              </motion.div>
            </Stack>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-4"
        >
          <Label color="muted" className="text-[10px]">Scroll</Label>
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Side Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute left-10 top-1/2 -translate-y-1/2 z-10 hidden xl:block pointer-events-none"
      >
        <Text
          size="xs"
          color="faint"
          className="tracking-[0.4em] uppercase [writing-mode:vertical-rl] rotate-180"
        >
          Interior Design Studio
        </Text>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute right-10 top-1/2 -translate-y-1/2 z-10 hidden xl:block pointer-events-none"
      >
        <Text
          size="xs"
          color="faint"
          className="tracking-[0.4em] uppercase [writing-mode:vertical-rl]"
        >
          Est. 2024 — Tel Aviv
        </Text>
      </motion.div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <Divider variant="gold" />
      </div>
    </Section>
  )
}
