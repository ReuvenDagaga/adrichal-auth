import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  href?: string
  to?: string
  className?: string
  children?: React.ReactNode
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-gold text-dark-900
    hover:bg-white hover:shadow-glow-md
    active:bg-gold-100
  `,
  secondary: `
    bg-dark-900 text-foreground border border-border
    hover:border-gold hover:text-gold
    active:bg-dark-800
  `,
  outline: `
    bg-transparent border border-border text-foreground
    hover:border-gold hover:text-gold
    active:bg-dark-900/50
  `,
  ghost: `
    bg-transparent text-foreground-muted
    hover:text-gold hover:bg-dark-900/30
    active:bg-dark-900/50
  `,
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-6 py-3 text-xs tracking-wider',
  md: 'px-8 py-4 text-xs tracking-widest',
  lg: 'px-12 py-5 text-sm tracking-widest',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      href,
      to,
      className,
      children,
      disabled,
      type = 'button',
      onClick,
    },
    ref
  ) => {
    const baseStyles = `
      relative inline-flex items-center justify-center gap-2
      uppercase font-medium
      transition-all duration-300
      focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark
      disabled:opacity-50 disabled:cursor-not-allowed
      overflow-hidden
    `

    const combinedClassName = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      className
    )

    const content = (
      <>
        {isLoading ? (
          <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span className="relative z-10">{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </>
    )

    // Router Link
    if (to) {
      return (
        <Link to={to} className={combinedClassName}>
          {content}
        </Link>
      )
    }

    // External Link
    if (href) {
      return (
        <a
          href={href}
          className={combinedClassName}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      )
    }

    // Button
    return (
      <motion.button
        ref={ref}
        type={type}
        className={combinedClassName}
        disabled={disabled || isLoading}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
