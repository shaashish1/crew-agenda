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
        return 'bg-success text-success-foreground hover:bg-success/80 shadow-sm';
      case 'amber':
        return 'bg-warning text-warning-foreground hover:bg-warning/80 shadow-sm';
      case 'red':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-sm';
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
