import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export type BadgeVariant = 'default' | 'gold' | 'outline'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-dark-800 text-foreground-muted border border-border',
  gold: 'bg-gold/10 text-gold border border-gold/30',
  outline: 'bg-transparent text-foreground-muted border border-border',
}

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          'uppercase tracking-wider font-medium',
          'rounded-radius-sm',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
