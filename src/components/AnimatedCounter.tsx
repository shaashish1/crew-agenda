import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  className?: string;
}

export const AnimatedCounter = ({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  label,
  className,
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startValue = 0;

    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4);
    };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.round(startValue + (end - startValue) * easedProgress);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <div
      ref={ref}
      className={cn(
        "text-center p-6 rounded-xl bg-card border border-border/50",
        "transition-all duration-300 hover:shadow-card-hover hover:border-primary/20",
        className
      )}
    >
      <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
        <span className="text-primary">{prefix}</span>
        <span>{count.toLocaleString()}</span>
        <span className="text-primary">{suffix}</span>
      </div>
      <p className="text-muted-foreground font-medium">{label}</p>
    </div>
  );
};

export default AnimatedCounter;
