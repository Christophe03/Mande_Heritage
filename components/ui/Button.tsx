'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'gold-outline' | 'dark' | 'dark-outline' | 'ivory' | 'ghost' | 'earth';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'gold',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      gold: 'bg-gradient-to-r from-mande-gold to-mande-goldDark text-mande-black hover:brightness-105 active:scale-[0.99] font-medium shadow-gold-sm hover:shadow-gold-md',
      'gold-outline':
        'border border-mande-gold text-mande-gold hover:bg-mande-gold hover:text-mande-black transition-colors duration-300 font-medium',
      dark: 'bg-mande-black text-mande-ivory hover:bg-mande-dark active:scale-[0.99] border border-mande-surface/60 font-medium',
      'dark-outline':
        'border border-mande-black/80 text-mande-black hover:bg-mande-black hover:text-mande-ivory transition-colors duration-300 font-medium',
      ivory: 'bg-mande-ivory text-mande-black hover:bg-white active:scale-[0.99] font-medium shadow-sm',
      ghost: 'bg-transparent text-current hover:bg-mande-gold/10 transition-colors',
      earth: 'bg-mande-earth text-mande-ivory hover:bg-mande-earthDark active:scale-[0.99]',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs tracking-wider uppercase',
      md: 'px-6 py-3 text-xs sm:text-sm tracking-wider uppercase',
      lg: 'px-8 py-4 text-sm sm:text-base tracking-widest uppercase',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-sans transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
