import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { staggerItem, staggerItemScale } from './variants'

export interface StaggerItemProps {
  scale?: boolean
  as?: 'div' | 'li' | 'article'
  className?: string
  children?: React.ReactNode
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  (
    {
      scale = false,
      as = 'div',
      className,
      children,
    },
    ref
  ) => {
    const Component = motion[as] as typeof motion.div

    return (
      <Component
        ref={ref}
        variants={scale ? staggerItemScale : staggerItem}
        className={cn(className)}
      >
        {children}
      </Component>
    )
  }
)

StaggerItem.displayName = 'StaggerItem'

export default StaggerItem
