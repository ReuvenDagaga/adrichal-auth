import { forwardRef, useState } from 'react'
import { cn } from '../../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-xs tracking-wider uppercase mb-3 transition-colors duration-normal',
              isFocused ? 'text-gold' : 'text-foreground-muted',
              error && 'text-red-400'
            )}
          >
            {label}
            {props.required && <span className="text-gold ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-transparent border-b py-4 text-foreground',
            'placeholder:text-foreground-faint',
            'focus:outline-none transition-colors duration-normal',
            error
              ? 'border-red-400 focus:border-red-400'
              : 'border-border focus:border-gold',
            className
          )}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />

        {(error || helperText) && (
          <p
            className={cn(
              'mt-2 text-xs',
              error ? 'text-red-400' : 'text-foreground-subtle'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
