import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export type ContainerSize = 'narrow' | 'default' | 'wide' | 'full'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
  centered?: boolean
}

const sizes: Record<ContainerSize, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl',
  full: 'max-w-full',
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = 'default',
      centered = true,
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
          'w-full px-4 sm:px-8 lg:px-[clamp(3rem,5vw,7rem)]',
          sizes[size],
          centered && 'mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'

export default Container
