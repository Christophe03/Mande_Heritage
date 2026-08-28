import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'dark' | 'ivory' | 'earth' | 'outline' | 'danger';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  className,
  variant = 'gold',
  size = 'sm',
  ...props
}: BadgeProps) {
  const variants = {
    gold: 'bg-mande-gold/15 text-mande-gold border border-mande-gold/30',
    dark: 'bg-mande-black text-mande-ivory border border-mande-surface',
    ivory: 'bg-mande-ivory text-mande-black border border-mande-ivoryDark',
    earth: 'bg-mande-earth/15 text-mande-earth border border-mande-earth/30',
    outline: 'border border-current bg-transparent',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20',
  };

  const sizes = {
    sm: 'text-[10px] tracking-wider uppercase px-2.5 py-0.5 font-medium',
    md: 'text-xs tracking-wider uppercase px-3 py-1 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-none font-sans',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
