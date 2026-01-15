import { useState, useRef, Suspense, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
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

// Simple Lamp Model - no lighting effects, just display
function LampModel() {
  const { scene } = useGLTF('/light.glb') as any
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    // Very subtle sway animation
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.008
    }
  })

  return (
    <group ref={groupRef} scale={1.5} position={[0, 0.5, 0]}>
      <primitive object={scene} />
    </group>
  )
}

// Camera controller for subtle movement
function CameraController() {
  const { camera } = useThree()

  useFrame((state) => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      state.pointer.x * 0.2,
      0.03
    )
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      state.pointer.y * 0.15,
      0.03
    )
    camera.lookAt(0, 0.3, 0)
  })

  return null
}

// 3D Scene Component - simple lamp display
function LampScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 7], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <CameraController />

        {/* Ambient light to see the model */}
        <ambientLight intensity={0.7} />

        {/* Environment for reflections */}
        <Environment preset="apartment" />

        {/* The lamp model */}
        <LampModel />
      </Suspense>
    </Canvas>
  )
}

// Living room background image URL (elegant dark living room)
const LIVING_ROOM_BG = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop'

export default function ProjectsShowcase() {
  const { t } = useTranslation('ui')
  const isMobile = useIsMobile()
  const [, setHoveredProject] = useState<string | null>(null)
  const [isLampHovered, setIsLampHovered] = useState(false)
  const { ref, isInView } = useScrollReveal()

  const handleLampHover = useCallback((hovered: boolean) => {
    setIsLampHovered(hovered)
  }, [])

  return (
    <Section
      background="default"
      className="relative overflow-hidden min-h-screen"
    >
      {/* Dark living room background */}
      <div
        className="absolute inset-0 z-0 transition-all duration-1000 ease-out"
        style={{
          backgroundImage: `url(${LIVING_ROOM_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: isMobile ? 'brightness(0.5)' : (isLampHovered ? 'brightness(0.6)' : 'brightness(0.1)'),
        }}
      />

      {/* Dark overlay that fades when lamp is on */}
      <div
        className="absolute inset-0 z-[1] transition-opacity duration-1000 ease-out bg-black"
        style={{
          opacity: isMobile ? 0.5 : (isLampHovered ? 0.3 : 0.85),
        }}
      />

      {/* Warm glow overlay when lamp is on - hide on mobile */}
      {!isMobile && (
        <div
          className="absolute inset-0 z-[2] pointer-events-none transition-opacity duration-1000 ease-out"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(255, 180, 100, 0.15) 0%, transparent 60%)',
            opacity: isLampHovered ? 1 : 0,
          }}
        />
      )}

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

          {/* Right side - 3D Lamp Scene for desktop, simple image for mobile */}
          <div className={`${isMobile ? 'order-1' : 'order-1 lg:order-2'} relative lg:sticky lg:top-8 self-start flex items-start justify-center`}>
            {isMobile ? (
              // Mobile: Simple elegant image
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative w-full h-[300px] rounded-lg overflow-hidden"
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
            ) : (
              // Desktop: 3D Lamp Scene
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] xl:h-[700px]"
                onMouseEnter={() => handleLampHover(true)}
                onMouseLeave={() => handleLampHover(false)}
              >
                {/* 3D Canvas */}
                <div className="absolute inset-0 cursor-pointer">
                  <LampScene />
                </div>

                {/* Elegant interaction hint */}
                <motion.div
                  className="absolute bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none"
                  animate={{
                    opacity: isLampHovered ? 0 : 1,
                    y: isLampHovered ? 10 : 0
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Pulsing ring indicator */}
                  <div className="relative flex items-center justify-center mb-3">
                    <motion.div
                      className="w-10 h-10 rounded-full border border-gold/40"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute w-6 h-6 rounded-full border border-gold/60 flex items-center justify-center">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-gold/80"
                        animate={{ scale: [0.8, 1, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                  </div>
                  <Text size="xs" color="subtle" className="tracking-[0.2em] uppercase text-[10px] lg:text-xs">
                    {t('projectsShowcase.hoverReveal')}
                  </Text>
                </motion.div>
              </motion.div>
            )}
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

// Preload the lamp model
useGLTF.preload('/light.glb')
