import { Badge } from "@/components/ui/badge";
import { PerformanceRating } from "@/types/project";
import { AlertCircle, AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PerformanceRatingBadgeProps {
  rating: PerformanceRating;
  delayPercentage?: number;
  adoptionRate?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PerformanceRatingBadge = ({
  rating,
  delayPercentage,
  adoptionRate,
  size = 'md',
  className,
}: PerformanceRatingBadgeProps) => {
  const getRatingConfig = (rating: PerformanceRating) => {
    switch (rating) {
      case 'critical':
        return {
          label: 'Critical',
          icon: AlertCircle,
          className: 'bg-destructive text-destructive-foreground border-destructive',
        };
      case 'high':
        return {
          label: 'High Risk',
          icon: AlertTriangle,
          className: 'bg-warning text-warning-foreground border-warning',
        };
      case 'medium':
        return {
          label: 'Medium',
          icon: TrendingUp,
          className: 'bg-ratingMedium text-ratingMedium-foreground border-ratingMedium',
        };
      case 'low':
        return {
          label: 'Excellent',
          icon: CheckCircle2,
          className: 'bg-success text-success-foreground border-success',
        };
    }
  };

  const config = getRatingConfig(rating);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const tooltipContent = (
    <div className="space-y-1">
      <p className="font-semibold">Performance Rating: {config.label}</p>
      {delayPercentage !== undefined && (
        <p className="text-sm">Project Delay: {delayPercentage}%</p>
      )}
      {adoptionRate !== null && adoptionRate !== undefined && (
        <p className="text-sm">User Adoption: {adoptionRate}%</p>
      )}
      {adoptionRate === null && (
        <p className="text-sm text-muted-foreground">User Adoption: Not yet measured</p>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            className={cn(
              'inline-flex items-center gap-1.5 font-semibold border-2',
              config.className,
              sizeClasses[size],
              className
            )}
          >
            <Icon className={iconSizes[size]} />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
