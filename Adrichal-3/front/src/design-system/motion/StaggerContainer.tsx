import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import type { UseInViewOptions } from 'framer-motion'
import { cn } from '../../utils/cn'
import { useScrollReveal } from './useScrollReveal'
import { staggerContainer, staggerContainerSlow } from './variants'

export interface StaggerContainerProps {
  slow?: boolean
  once?: boolean
  margin?: UseInViewOptions['margin']
  as?: 'div' | 'ul' | 'section'
  className?: string
  children?: React.ReactNode
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  (
    {
      slow = false,
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

    return (
      <Component
        ref={ref}
        initial="initial"
        animate={isInView ? 'animate' : 'initial'}
        variants={slow ? staggerContainerSlow : staggerContainer}
        className={cn(className)}
      >
        {children}
      </Component>
    )
  }
)

StaggerContainer.displayName = 'StaggerContainer'

export default StaggerContainer
