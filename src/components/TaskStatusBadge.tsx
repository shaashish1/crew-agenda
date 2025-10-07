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
        return "bg-success text-success-foreground";
      case "In Progress":
        return "bg-info text-info-foreground";
      case "Overdue":
        return "bg-destructive text-destructive-foreground";
      case "On Hold":
        return "bg-warning text-warning-foreground";
      case "Not Started":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Badge className={cn("font-medium", getStatusColor(status))}>
      {status}
    </Badge>
  );
};
