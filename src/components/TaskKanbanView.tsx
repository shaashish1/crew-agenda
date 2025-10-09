import React from "react";
import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

interface TaskKanbanViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskKanbanView: React.FC<TaskKanbanViewProps> = ({ tasks, onTaskClick }) => {
  const columns = [
    { id: "Not Started", title: "Not Started", color: "bg-slate-100" },
    { id: "In Progress", title: "In Progress", color: "bg-blue-50" },
    { id: "Completed", title: "Completed", color: "bg-green-50" },
    { id: "Blocked", title: "Blocked", color: "bg-red-50" }
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map(column => (
        <div key={column.id} className={`${column.color} rounded-lg p-4`}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            {column.title}
            <Badge variant="secondary">{getTasksByStatus(column.id).length}</Badge>
          </h3>
          <div className="space-y-3">
            {getTasksByStatus(column.id).map(task => (
              <Card
                key={task.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onTaskClick(task)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-medium line-clamp-2">
                      {task.actionItem}
                    </CardTitle>
                    {task.sentiment && (
                      <span className="text-lg flex-shrink-0">{task.sentiment}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className="truncate">{task.owner}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(task.targetDate).toLocaleDateString()}</span>
                  </div>
                  {task.category && (
                    <Badge variant="outline" className="text-xs">{task.category}</Badge>
                  )}
                  {task.priority_score !== undefined && task.priority_score > 0 && (
                    <div className="mt-2">
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            task.priority_score > 70 ? 'bg-red-500' :
                            task.priority_score > 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${task.priority_score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskKanbanView;
