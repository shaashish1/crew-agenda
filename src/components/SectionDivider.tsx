import { cn } from '@/lib/utils';

interface SectionDividerProps {
  className?: string;
  variant?: 'gradient' | 'dots' | 'wave';
}

export const SectionDivider = ({ className, variant = 'gradient' }: SectionDividerProps) => {
  if (variant === 'gradient') {
    return (
      <div className={cn('w-full py-12', className)}>
        <div className="container mx-auto px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('w-full py-12', className)}>
        <div className="container mx-auto px-6 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/40" />
          <div className="w-2 h-2 rounded-full bg-primary/60" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-primary/60" />
          <div className="w-2 h-2 rounded-full bg-primary/40" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full py-12', className)}>
      <div className="container mx-auto px-6">
        <svg
          className="w-full h-4 text-primary/20"
          viewBox="0 0 1200 20"
          preserveAspectRatio="none"
        >
          <path
            d="M0,10 Q300,0 600,10 T1200,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};
