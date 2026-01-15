import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { projects } from '../data/projects'
import RoomPreview from '../components/3d/RoomPreview'

// Check if device is mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export default function ProjectDetail() {
  const { t } = useTranslation('ui')
  const { id } = useParams()
  const project = projects.find(p => p.id === id)
  const [showRoom, setShowRoom] = useState(false)
  const isMobile = useIsMobile()

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const projectIndex = projects.findIndex(p => p.id === id)
  const nextProject = projects[(projectIndex + 1) % projects.length]
  const prevProject = projects[(projectIndex - 1 + projects.length) % projects.length]

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Image */}
      <div className="relative h-[70vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        {/* Ambient lighting overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px]" />
        </div>

        {/* Back Button */}
        <Link
          to="/projects"
          className="absolute top-32 left-8 lg:left-20 flex items-center gap-3 text-white/60 hover:text-gold transition-colors duration-300"
        >
          <span>←</span>
          <span className="text-sm tracking-[0.2em] uppercase">{t('projects.backToProjects')}</span>
        </Link>
      </div>

      {/* Project Info */}
      <div className="container mx-auto px-8 md:px-12 lg:px-20 xl:px-28 -mt-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4">
            {project.category}
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8">
            {project.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap gap-8 mb-12 text-gray-400">
            <div>
              <p className="text-xs tracking-wider uppercase text-white/40 mb-1">{t('projects.location')}</p>
              <p>{project.location}</p>
            </div>
            <div>
              <p className="text-xs tracking-wider uppercase text-white/40 mb-1">{t('projects.year')}</p>
              <p>{project.year}</p>
            </div>
            <div>
              <p className="text-xs tracking-wider uppercase text-white/40 mb-1">{t('projects.area')}</p>
              <p>{project.area}</p>
            </div>
          </div>

          <p className="text-xl text-gray-300 leading-relaxed mb-16">
            {project.description}
          </p>
        </motion.div>

        {/* Gallery */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {project.images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative aspect-[4/3] overflow-hidden group"
            >
              <img
                src={image}
                alt={`${project.title} - ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* 3D Room Preview Section - Desktop Only */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-24"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-gold text-sm tracking-[0.4em] uppercase mb-2">{t('projects.interactiveExperience')}</p>
                <h3 className="text-3xl md:text-4xl font-light text-white">
                  {t('projects.explore3d')} <span className="italic font-extralight">{t('projects.3d')}</span>
                </h3>
              </div>
              <motion.button
                onClick={() => setShowRoom(!showRoom)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 border border-gold/50 text-gold text-sm tracking-[0.2em] uppercase hover:bg-gold hover:text-black transition-all duration-300"
              >
                {showRoom ? t('projects.hide3dView') : t('projects.viewRoom')}
              </motion.button>
            </div>

            {/* 3D Canvas */}
            <motion.div
              initial={false}
              animate={{ height: showRoom ? '70vh' : 0, opacity: showRoom ? 1 : 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="relative overflow-hidden rounded-sm"
            >
              {showRoom && (
                <div className="absolute inset-0 bg-[#080808]">
                  {/* Ambient background glow */}
                  <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
                  <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-white/3 rounded-full blur-[100px] pointer-events-none" />

                  <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-gold text-sm tracking-[0.3em] uppercase">{t('projects.loading3d')}</div>
                    </div>
                  }>
                    <Canvas
                      gl={{
                        antialias: false,
                        powerPreference: 'default',
                        failIfMajorPerformanceCaveat: true
                      }}
                    >
                      <PerspectiveCamera makeDefault position={[4, 3, 6]} fov={45} />
                      <ambientLight intensity={0.3} />
                      <directionalLight position={[5, 5, 5]} intensity={0.5} />
                      <pointLight position={[-3, 2, 2]} intensity={0.3} color="#d4af37" />
                      <RoomPreview />
                      <OrbitControls
                        enablePan={false}
                        enableZoom={true}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 2}
                        minDistance={4}
                        maxDistance={12}
                        autoRotate
                        autoRotateSpeed={0.3}
                      />
                    </Canvas>
                  </Suspense>

                  {/* Instructions overlay */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 text-white/40 text-xs tracking-wider">
                    <span>{t('projects.dragToRotate')}</span>
                    <span className="w-[1px] h-4 bg-white/20" />
                    <span>{t('projects.scrollToZoom')}</span>
                  </div>

                  {/* Gold border accent */}
                  <div className="absolute inset-0 border border-gold/10 pointer-events-none" />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="border-t border-white/10 py-16">
          <div className="flex justify-between items-center">
            <Link
              to={`/projects/${prevProject.id}`}
              className="group flex items-center gap-4"
            >
              <span className="text-white/40 group-hover:text-gold transition-colors duration-300">←</span>
              <div>
                <p className="text-xs tracking-wider uppercase text-white/40 mb-1">{t('projects.previous')}</p>
                <p className="text-white group-hover:text-gold transition-colors duration-300">
                  {prevProject.title}
                </p>
              </div>
            </Link>

            <Link
              to={`/projects/${nextProject.id}`}
              className="group flex items-center gap-4 text-right"
            >
              <div>
                <p className="text-xs tracking-wider uppercase text-white/40 mb-1">{t('projects.next')}</p>
                <p className="text-white group-hover:text-gold transition-colors duration-300">
                  {nextProject.title}
                </p>
              </div>
              <span className="text-white/40 group-hover:text-gold transition-colors duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
