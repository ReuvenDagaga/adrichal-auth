import { forwardRef, type ElementType } from 'react'
import { cn } from '../../utils/cn'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingSize = 'display-1' | 'display-2' | 'heading-1' | 'heading-2' | 'heading-3'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel
  size?: HeadingSize
  accent?: boolean
  gradient?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
}

const sizes: Record<HeadingSize, string> = {
  'display-1': 'text-[clamp(2.5rem,6vw,6rem)] font-extralight leading-[1.1] tracking-tight',
  'display-2': 'text-[clamp(2rem,5vw,5rem)] font-extralight leading-[1.1] tracking-tight',
  'heading-1': 'text-[clamp(1.75rem,4vw,3.5rem)] font-light leading-[1.15]',
  'heading-2': 'text-[clamp(1.375rem,2.5vw,2rem)] font-light leading-[1.25]',
  'heading-3': 'text-[clamp(1.125rem,1.5vw,1.5rem)] font-light leading-[1.35]',
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level = 2,
      size = 'heading-1',
      accent = false,
      gradient = false,
      as,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Tag: ElementType = as || `h${level}`

    return (
      <Tag
        ref={ref}
        className={cn(
          'text-foreground',
          sizes[size],
          accent && 'italic font-thin',
          gradient && 'text-gradient',
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    )
  }
)

Heading.displayName = 'Heading'

export default Heading
