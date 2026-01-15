import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { blogPosts, blogCategories } from '../data/blog'
import { useIsMobile } from '../hooks/useIsMobile'

export default function Blog() {
  const isMobile = useIsMobile()
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredPost, setHoveredPost] = useState<string | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  const filteredPosts = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory)

  const featuredPost = blogPosts[0]
  const regularPosts = activeCategory === 'All'
    ? filteredPosts.slice(1)
    : filteredPosts

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
            Insights & Inspiration
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4 sm:mb-6 lg:mb-8">
            Blog
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl">
            Explore the latest trends, tips, and insights in interior design.
            From color psychology to sustainable materials, we share our expertise.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 sm:gap-4 mb-12 lg:mb-16 overflow-x-auto pb-4 scrollbar-hide"
        >
          {blogCategories.slice(0, isMobile ? 5 : 8).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 px-3 sm:px-4 py-2 border ${
                activeCategory === category
                  ? 'text-black bg-gold border-gold'
                  : 'text-white/50 border-white/20 hover:text-white hover:border-white/50'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Featured Post - Only show when "All" is selected */}
        {activeCategory === 'All' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 lg:mb-20"
          >
            <Link
              to={`/blog/${featuredPost.id}`}
              className="group block"
            >
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg lg:rounded-none">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isMobile ? '' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'
                    }`}
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="text-white/90 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase bg-gold/90 px-3 sm:px-4 py-1.5 sm:py-2">
                      Featured
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <span className="text-gold text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                      {featuredPost.category}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-white/50 text-xs sm:text-sm">{formatDate(featuredPost.date)}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white group-hover:text-gold transition-colors duration-300 mb-3 sm:mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-medium">
                        {featuredPost.author[0]}
                      </div>
                      <span className="text-white/70 text-sm">{featuredPost.author}</span>
                    </div>
                    <span className="text-white/30">•</span>
                    <span className="text-white/50 text-sm">{featuredPost.readTime} read</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {regularPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: isMobile ? 0 : index * 0.1 }}
            >
              <Link
                to={`/blog/${post.id}`}
                className="group block"
                onMouseEnter={() => !isMobile && setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-4 sm:mb-6 rounded-lg sm:rounded-none">
                  <img
                    src={post.image}
                    alt={post.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isMobile ? '' : (hoveredPost === post.id ? 'scale-110 grayscale-0' : 'scale-100 grayscale')
                    }`}
                  />
                  {post.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-gold/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <svg className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-black ml-1`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white/80 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase bg-black/50 px-2 sm:px-3 py-1">
                    {post.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                  <span className="text-white/50 text-xs sm:text-sm">{formatDate(post.date)}</span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/50 text-xs sm:text-sm">{post.readTime} read</span>
                </div>

                <h3 className="text-lg sm:text-xl font-light text-white group-hover:text-gold transition-colors duration-300 mb-2 sm:mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-medium">
                    {post.author[0]}
                  </div>
                  <span className="text-white/60 text-xs sm:text-sm">{post.author}</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {/* Load More - placeholder for future pagination */}
        {filteredPosts.length > 9 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <button className="px-8 py-4 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 text-sm tracking-[0.2em] uppercase">
              Load More Articles
            </button>
          </motion.div>
        )}
      </div>
    </main>
  )
}
