import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export type TextSize = 'lg' | 'base' | 'sm' | 'xs'
export type TextColor = 'default' | 'muted' | 'subtle' | 'faint' | 'accent'

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: TextSize
  color?: TextColor
  as?: 'p' | 'span' | 'div'
  leading?: 'tight' | 'normal' | 'relaxed'
}

const sizes: Record<TextSize, string> = {
  lg: 'text-[clamp(1.125rem,1.5vw,1.25rem)]',
  base: 'text-base',
  sm: 'text-sm',
  xs: 'text-xs',
}

const colors: Record<TextColor, string> = {
  default: 'text-foreground',
  muted: 'text-foreground-muted',
  subtle: 'text-foreground-subtle',
  faint: 'text-foreground-faint',
  accent: 'text-gold',
}

const leadings: Record<string, string> = {
  tight: 'leading-tight',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      size = 'base',
      color = 'default',
      as = 'p',
      leading = 'relaxed',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Tag = as

    return (
      <Tag
        ref={ref as React.Ref<HTMLParagraphElement>}
        className={cn(
          'font-light',
          sizes[size],
          colors[color],
          leadings[leading],
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    )
  }
)

Text.displayName = 'Text'

export default Text
