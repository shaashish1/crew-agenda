import { TaskStatus } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

export const TaskStatusBadge = ({ status }: TaskStatusBadgeProps) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "Completed":
        return "bg-success text-success-foreground hover:bg-success/80";
      case "In Progress":
        return "bg-info text-info-foreground hover:bg-info/80";
      case "Overdue":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/80";
      case "On Hold":
        return "bg-warning text-warning-foreground hover:bg-warning/80";
      case "Not Started":
        return "bg-muted text-muted-foreground hover:bg-muted/80";
      default:
        return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    }
  };

  return (
    <Badge className={cn("font-medium", getStatusColor(status))}>
      {status}
    </Badge>
  );
};
