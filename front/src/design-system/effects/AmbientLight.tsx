import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export type AmbientColor = 'gold' | 'white'
export type AmbientIntensity = 'subtle' | 'medium' | 'strong'
export type AmbientSize = 'sm' | 'md' | 'lg' | 'xl'
export type AmbientPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface AmbientLightProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: AmbientColor
  intensity?: AmbientIntensity
  size?: AmbientSize
  position?: AmbientPosition
  animate?: boolean
}

const colors: Record<AmbientColor, Record<AmbientIntensity, string>> = {
  gold: {
    subtle: 'bg-gold/3',
    medium: 'bg-gold/5',
    strong: 'bg-gold/8',
  },
  white: {
    subtle: 'bg-white/2',
    medium: 'bg-white/3',
    strong: 'bg-white/5',
  },
}

const sizes: Record<AmbientSize, string> = {
  sm: 'w-[200px] h-[200px] blur-[80px]',
  md: 'w-[300px] h-[300px] blur-[100px]',
  lg: 'w-[500px] h-[500px] blur-[150px]',
  xl: 'w-[800px] h-[800px] blur-[180px]',
}

const positions: Record<AmbientPosition, string> = {
  'top-left': 'top-0 left-0 -translate-x-1/4 -translate-y-1/4',
  'top-center': 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/4',
  'top-right': 'top-0 right-0 translate-x-1/4 -translate-y-1/4',
  'center-left': 'top-1/2 left-0 -translate-x-1/4 -translate-y-1/2',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'center-right': 'top-1/2 right-0 translate-x-1/4 -translate-y-1/2',
  'bottom-left': 'bottom-0 left-0 -translate-x-1/4 translate-y-1/4',
  'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4',
  'bottom-right': 'bottom-0 right-0 translate-x-1/4 translate-y-1/4',
}

export const AmbientLight = forwardRef<HTMLDivElement, AmbientLightProps>(
  (
    {
      color = 'gold',
      intensity = 'subtle',
      size = 'lg',
      position = 'top-center',
      animate = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'absolute rounded-full pointer-events-none',
          colors[color][intensity],
          sizes[size],
          positions[position],
          animate && 'animate-drift',
          className
        )}
        aria-hidden="true"
        {...props}
      />
    )
  }
)

AmbientLight.displayName = 'AmbientLight'

export default AmbientLight
