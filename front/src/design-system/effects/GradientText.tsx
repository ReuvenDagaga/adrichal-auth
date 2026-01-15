import { cn } from '../../utils/cn'

export type GradientType = 'gold' | 'silver' | 'white'

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  gradient?: GradientType
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const gradients: Record<GradientType, string> = {
  gold: 'from-gold via-gold-200 to-gold',
  silver: 'from-white via-dark-200 to-white',
  white: 'from-white via-foreground-muted to-white',
}

export function GradientText({
  gradient = 'gold',
  as: Tag = 'span',
  className,
  children,
  ...props
}: GradientTextProps) {
  return (
    <Tag
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        gradients[gradient],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default GradientText
