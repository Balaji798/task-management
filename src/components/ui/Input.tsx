/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    label,
    error,
    helperText,
    variant = 'default',
    size = 'md',
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    type = 'text',
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${React.useId()}`;
    
    const baseStyles = 'block w-full rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
    
    const variants = {
      default: 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus-visible:border-blue-500 focus-visible:ring-blue-500',
      outlined: 'border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus-visible:border-blue-500 focus-visible:ring-blue-500'
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base'
    };

    const inputStyles = [
      baseStyles,
      variants[variant],
      sizes[size],
      error && 'border-red-500 text-red-900 placeholder-red-300 focus-visible:border-red-500 focus-visible:ring-red-500',
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      className
    ].filter(Boolean).join(' ');

    const containerStyles = [
      'relative',
      fullWidth ? 'w-full' : 'w-auto'
    ].filter(Boolean).join(' ');

    const labelStyles = 'block text-sm font-medium text-gray-700 mb-1';
    const errorStyles = 'text-sm text-red-600 mt-1';
    const helperStyles = 'text-sm text-gray-500 mt-1';
    const iconContainerStyles = 'absolute inset-y-0 flex items-center pointer-events-none';

    return (
      <div className={containerStyles}>
        {label && (
          <label htmlFor={inputId} className={labelStyles}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className={`${iconContainerStyles} left-0 pl-3`}>
              <div className="h-4 w-4 text-gray-400">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            id={inputId}
            type={type}
            className={inputStyles}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          
          {rightIcon && (
            <div className={`${iconContainerStyles} right-0 pr-3`}>
              <div className="h-4 w-4 text-gray-400">
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className={errorStyles}>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className={helperStyles}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;