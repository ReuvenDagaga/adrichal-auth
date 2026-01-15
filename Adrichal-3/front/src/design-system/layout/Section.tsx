import { cn } from '../../utils/cn'

export type SectionBackground = 'default' | 'elevated' | 'muted'
export type SectionPadding = 'default' | 'compact' | 'none'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  background?: SectionBackground
  padding?: SectionPadding
  as?: 'section' | 'div' | 'article'
}

const backgrounds: Record<SectionBackground, string> = {
  default: 'bg-background',
  elevated: 'bg-background-elevated',
  muted: 'bg-background-muted',
}

const paddings: Record<SectionPadding, string> = {
  default: 'py-[clamp(6rem,10vw,10rem)]',
  compact: 'py-16 md:py-24',
  none: '',
}

export function Section({
  background = 'default',
  padding = 'default',
  as: Tag = 'section',
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(
        'relative overflow-hidden',
        backgrounds[background],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Section
