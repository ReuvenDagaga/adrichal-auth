import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export type DividerVariant = 'solid' | 'gradient' | 'gold'
export type DividerOrientation = 'horizontal' | 'vertical'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: DividerVariant
  orientation?: DividerOrientation
}

const variants: Record<DividerVariant, string> = {
  solid: 'bg-border',
  gradient: 'bg-gradient-to-r from-transparent via-border to-transparent',
  gold: 'bg-gradient-to-r from-transparent via-gold/30 to-transparent',
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      variant = 'gradient',
      orientation = 'horizontal',
      className,
      ...props
    },
    ref
  ) => {
    const isHorizontal = orientation === 'horizontal'

    return (
      <div
        ref={ref}
        role="separator"
        className={cn(
          isHorizontal ? 'w-full h-[1px]' : 'h-full w-[1px]',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Divider.displayName = 'Divider'

export default Divider
