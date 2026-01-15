import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type StackDirection = 'vertical' | 'horizontal'
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around'

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: StackGap
  direction?: StackDirection
  align?: StackAlign
  justify?: StackJustify
  wrap?: boolean
}

const gaps: Record<StackGap, string> = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
  '2xl': 'gap-16',
}

const directions: Record<StackDirection, string> = {
  vertical: 'flex-col',
  horizontal: 'flex-row',
}

const alignments: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifications: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      gap = 'md',
      direction = 'vertical',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          directions[direction],
          gaps[gap],
          alignments[align],
          justifications[justify],
          wrap && 'flex-wrap',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Stack.displayName = 'Stack'

export default Stack
