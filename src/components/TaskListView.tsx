import React from "react";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, AlertCircle } from "lucide-react";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onTaskClick }) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onTaskClick(task)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{task.sentiment || "😐"}</span>
                  <CardTitle className="text-lg">{task.actionItem}</CardTitle>
                </div>
                {task.progressComments && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {task.progressComments}
                  </p>
                )}
              </div>
              <TaskStatusBadge status={task.status} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{task.owner}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(task.targetDate).toLocaleDateString()}</span>
              </div>
              {task.category && (
                <Badge variant="outline">{task.category}</Badge>
              )}
              {task.priority_score !== undefined && task.priority_score > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Priority:</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        task.priority_score > 70 ? 'bg-red-500' :
                        task.priority_score > 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${task.priority_score}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{task.priority_score}</span>
                </div>
              )}
              {task.dependencies && task.dependencies.length > 0 && (
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs">{task.dependencies.length} dependencies</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskListView;
