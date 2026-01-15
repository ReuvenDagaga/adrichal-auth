import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { useIsMobile } from '../hooks/useIsMobile'

const categories = ['All', 'Residential', 'Commercial']

export default function Projects() {
  const isMobile = useIsMobile()
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 lg:mb-16"
        >
          <p className="text-gold text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-3 sm:mb-4">
            Our Work
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 sm:mb-6 lg:mb-8">
            Projects
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
            Explore our portfolio of exceptional interior design projects,
            each crafted with passion and precision.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 sm:gap-6 mb-12 lg:mb-16"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase transition-colors duration-300 ${
                activeCategory === category
                  ? 'text-gold'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: isMobile ? 0 : index * 0.1 }}
            >
              <Link
                to={`/projects/${project.id}`}
                className="group block"
                onMouseEnter={() => !isMobile && setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-4 sm:mb-6 rounded-lg sm:rounded-none">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isMobile ? '' : (hoveredProject === project.id ? 'scale-110 grayscale-0' : 'scale-100 grayscale')
                    }`}
                  />

                  {/* Overlay - hide on mobile */}
                  {!isMobile && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}

                  {/* View Button - hide on mobile */}
                  {!isMobile && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                    >
                      <span className="px-6 py-3 border border-white text-white text-sm tracking-[0.2em] uppercase">
                        View Project
                      </span>
                    </motion.div>
                  )}

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white/80 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase bg-black/50 px-2 sm:px-3 py-1">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-light text-white group-hover:text-gold transition-colors duration-300 mb-1 sm:mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {project.location} — {project.year}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
