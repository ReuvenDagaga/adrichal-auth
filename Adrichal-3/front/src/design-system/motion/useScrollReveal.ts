import { useRef } from 'react'
import { useInView } from 'framer-motion'
import type { UseInViewOptions } from 'framer-motion'

export interface ScrollRevealOptions {
  once?: boolean
  margin?: UseInViewOptions['margin']
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { once = true, margin = '-100px' } = options

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin })

  return { ref, isInView }
}

export default useScrollReveal
