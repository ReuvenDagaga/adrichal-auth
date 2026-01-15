import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import type { Variants, Easing, UseInViewOptions } from 'framer-motion'
import { cn } from '../../utils/cn'
import { useScrollReveal } from './useScrollReveal'
import { fadeIn, fadeInUp, fadeInDown, fadeInLeft, fadeInRight, scaleIn, staggerContainer } from './variants'

export type MotionVariant = 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'stagger'

export interface MotionSectionProps {
  variant?: MotionVariant
  delay?: number
  duration?: number
  once?: boolean
  margin?: UseInViewOptions['margin']
  as?: 'div' | 'section' | 'article'
  className?: string
  children?: React.ReactNode
}

const variantsMap: Record<MotionVariant, Variants> = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  stagger: staggerContainer,
}

const defaultEasing: Easing = [0.22, 1, 0.36, 1]

export const MotionSection = forwardRef<HTMLDivElement, MotionSectionProps>(
  (
    {
      variant = 'fadeInUp',
      delay = 0,
      duration,
      once = true,
      margin = '-100px',
      as = 'div',
      className,
      children,
    },
    _
  ) => {
    const { ref, isInView } = useScrollReveal({ once, margin })
    const Component = motion[as] as typeof motion.div

    const selectedVariant = variantsMap[variant]

    // Override transition if delay or duration provided
    const customTransition = (delay || duration) ? {
      delay,
      duration: duration || 0.8,
      ease: defaultEasing
    } : undefined

    return (
      <Component
        ref={ref}
        initial="initial"
        animate={isInView ? 'animate' : 'initial'}
        variants={selectedVariant}
        transition={customTransition}
        className={cn(className)}
      >
        {children}
      </Component>
    )
  }
)

MotionSection.displayName = 'MotionSection'

export default MotionSection
