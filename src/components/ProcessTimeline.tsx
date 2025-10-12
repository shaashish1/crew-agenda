import { CheckCircle2, Circle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '@/lib/utils';

interface TimelineStep {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface ProcessTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export const ProcessTimeline = ({ steps, className }: ProcessTimelineProps) => {
  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary-light opacity-30 hidden md:block" />
      
      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={index} className="relative fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
            <div className="flex items-start gap-6">
              {/* Timeline dot */}
              <div className="hidden md:flex relative z-10 flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-premium-lg">
                  {step.icon || <CheckCircle2 className="w-8 h-8 text-white" />}
                </div>
              </div>

              {/* Content */}
              <GlassCard variant="premium" className="flex-1 hover-lift">
                <div className="flex items-start gap-4">
                  <div className="md:hidden w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-premium-md flex-shrink-0">
                    {step.icon || <Circle className="w-6 h-6 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-heading mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {step.title}
                    </h3>
                    <p className="text-body-large text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
