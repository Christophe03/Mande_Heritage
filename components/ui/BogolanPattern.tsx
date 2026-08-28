import React from 'react';
import { cn } from '@/lib/utils';

interface BogolanDividerProps {
  className?: string;
  variant?: 'gold' | 'earth' | 'dark' | 'sand';
}

export function BogolanDivider({ className, variant = 'gold' }: BogolanDividerProps) {
  const colorMap = {
    gold: 'text-mande-gold',
    earth: 'text-mande-earth',
    dark: 'text-mande-black',
    sand: 'text-mande-sand',
  };

  return (
    <div className={cn('flex items-center justify-center gap-3 my-6 opacity-75', className)}>
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-current" />
      <svg
        width="44"
        height="14"
        viewBox="0 0 44 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('w-8 h-3', colorMap[variant])}
      >
        <path
          d="M2 7L7 2L12 7L7 12L2 7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M17 7L22 2L27 7L22 12L17 7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <path
          d="M32 7L37 2L42 7L37 12L32 7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}

export function BogolanBorder({ className }: { className?: string }) {
  return (
    <div className={cn('w-full overflow-hidden h-2 flex items-center opacity-35', className)}>
      <div className="w-full flex justify-around">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="inline-block text-[10px] tracking-widest text-mande-gold">
            ◆ ◇ ◆
          </span>
        ))}
      </div>
    </div>
  );
}

export function BogolanMotifIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('text-mande-gold', className)}
    >
      <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1.2" />
      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.2" />
      <line x1="21" y1="3" x2="3" y2="21" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
