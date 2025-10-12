import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'subtle';
  hover?: boolean;
}

export const GlassCard = ({ 
  children, 
  className, 
  variant = 'default',
  hover = true 
}: GlassCardProps) => {
  const variants = {
    default: 'glass-card',
    premium: 'glass-card-premium',
    subtle: 'bg-card/50 backdrop-blur-sm border border-border/50',
  };

  return (
    <div 
      className={cn(
        'rounded-2xl p-8 transition-all duration-500',
        variants[variant],
        hover && 'hover-lift',
        className
      )}
    >
      {children}
    </div>
  );
};
