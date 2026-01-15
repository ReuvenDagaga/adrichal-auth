import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'interactive'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
  as?: 'div' | 'article' | 'section'
}

const variants: Record<CardVariant, string> = {
  default: 'bg-transparent border border-border',
  elevated: 'bg-background-elevated border border-border shadow-lg',
  bordered: 'bg-transparent border border-border-accent',
  interactive: `
    bg-transparent border border-border
    hover:border-gold/50 hover:shadow-glow-sm
    transition-all duration-normal
    cursor-pointer
  `,
}

const paddings: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8 lg:p-10',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      as = 'div',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isInteractive = variant === 'interactive'

    if (isInteractive) {
      const MotionComponent = motion[as] as typeof motion.div
      return (
        <MotionComponent
          ref={ref}
          className={cn(
            'rounded-radius-sm overflow-hidden',
            variants[variant],
            paddings[padding],
            className
          )}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </MotionComponent>
      )
    }

    const Tag = as
    return (
      <Tag
        ref={ref}
        className={cn(
          'rounded-radius-sm overflow-hidden',
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    )
  }
)

Card.displayName = 'Card'

export default Card
