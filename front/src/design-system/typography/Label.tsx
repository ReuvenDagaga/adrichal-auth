import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export type LabelColor = 'default' | 'muted' | 'accent'

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: LabelColor
  uppercase?: boolean
}

const colors: Record<LabelColor, string> = {
  default: 'text-foreground-muted',
  muted: 'text-foreground-subtle',
  accent: 'text-gold',
}

export const Label = forwardRef<HTMLSpanElement, LabelProps>(
  (
    {
      color = 'default',
      uppercase = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          'text-xs md:text-sm tracking-[0.4em] font-light',
          uppercase && 'uppercase',
          colors[color],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Label.displayName = 'Label'

export default Label
