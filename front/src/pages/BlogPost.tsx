import { useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { blogPosts } from '../data/blog'
import ReactMarkdown from 'react-markdown'

export default function BlogPost() {
  const { t } = useTranslation('ui')
  const { id } = useParams<{ id: string }>()
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  const post = blogPosts.find(p => p.id === id)

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Find related posts
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(tag => post.tags.includes(tag))))
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Image */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />
        </div>

        {/* Back Button */}
        <Link
          to="/blog"
          className="absolute top-32 left-6 lg:left-12 z-20 flex items-center gap-2 text-white/70 hover:text-gold transition-colors duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm tracking-wider uppercase">{t('blog.backToBlog')}</span>
        </Link>

        {/* Title Section */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-6 lg:px-12 pb-12">
            <motion.div
              ref={headerRef}
              initial={{ opacity: 0, y: 50 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gold text-xs tracking-[0.2em] uppercase bg-gold/10 px-4 py-2">
                  {post.category}
                </span>
                <span className="text-white/50 text-sm">{formatDate(post.date)}</span>
                <span className="text-white/30">•</span>
                <span className="text-white/50 text-sm">{post.readTime} read</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                {post.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            {/* Author Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4 mb-12 pb-12 border-b border-white/10"
            >
              <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center text-gold text-lg font-medium">
                {post.author[0]}
              </div>
              <div>
                <p className="text-white font-medium">{post.author}</p>
                <p className="text-white/50 text-sm">{t('blog.interiorDesignExpert')}</p>
              </div>
            </motion.div>

            {/* Excerpt */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-gray-300 leading-relaxed mb-12"
            >
              {post.excerpt}
            </motion.p>

            {/* Video if exists */}
            {post.videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mb-12"
              >
                <div className="relative aspect-video overflow-hidden bg-black/50">
                  <iframe
                    src={post.videoUrl}
                    title={post.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="text-white/40 text-sm mt-3 text-center">{t('blog.watchVideoForInsights')}</p>
              </motion.div>
            )}

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-light prose-headings:text-white
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-gold
                prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-6
                prose-strong:text-white prose-strong:font-medium
                prose-ul:text-gray-400 prose-li:mb-2
                prose-a:text-gold prose-a:no-underline hover:prose-a:underline"
            >
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 pt-12 border-t border-white/10"
            >
              <p className="text-white/50 text-sm uppercase tracking-wider mb-4">{t('blog.tags')}</p>
              <div className="flex flex-wrap gap-3">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-4 py-2 text-sm text-white/70 border border-white/20 hover:border-gold hover:text-gold transition-colors duration-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-12 pt-12 border-t border-white/10"
            >
              <p className="text-white/50 text-sm uppercase tracking-wider mb-4">{t('blog.shareThisArticle')}</p>
              <div className="flex gap-4">
                {['Facebook', 'Twitter', 'LinkedIn', 'Pinterest'].map(platform => (
                  <button
                    key={platform}
                    className="w-12 h-12 border border-white/20 flex items-center justify-center text-white/60 hover:border-gold hover:text-gold transition-colors duration-300"
                  >
                    {platform[0]}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-24 bg-black/30">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4">{t('blog.continueReading')}</p>
              <h2 className="text-3xl md:text-4xl font-light text-white">{t('blog.relatedArticles')}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((relatedPost, index) => (
                <motion.article
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link to={`/blog/${relatedPost.id}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden mb-6">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                      <span className="absolute top-4 left-4 text-white/80 text-xs tracking-[0.2em] uppercase bg-black/50 px-3 py-1">
                        {relatedPost.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-light text-white group-hover:text-gold transition-colors duration-300 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-white/50 text-sm mt-2">{relatedPost.readTime} read</p>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
              {t('blog.readyToTransform')}
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              {t('blog.letsTransformYourHome')}
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-gold text-black text-sm tracking-[0.2em] uppercase font-medium hover:bg-white transition-colors duration-300"
            >
              {t('buttons.getInTouch')}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
