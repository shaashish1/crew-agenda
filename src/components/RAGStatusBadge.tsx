import { Badge } from "@/components/ui/badge";
import { RAGStatus } from "@/types/project";
import { cn } from "@/lib/utils";

interface RAGStatusBadgeProps {
  status: RAGStatus;
  className?: string;
}

export const RAGStatusBadge = ({ status, className }: RAGStatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'green':
        return 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]/80';
      case 'amber':
        return 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning))]/80';
      case 'red':
        return 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive))]/80';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'green':
        return 'On Track';
      case 'amber':
        return 'At Risk';
      case 'red':
        return 'Delayed';
    }
  };

  return (
    <Badge className={cn(getStatusColor(), className)}>
      {getStatusLabel()}
    </Badge>
  );
};
