import React from "react";
import { Task } from "@/types/task";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TaskTableViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskTableView: React.FC<TaskTableViewProps> = ({ tasks, onTaskClick }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead className="w-12">Mood</TableHead>
            <TableHead>Action Item</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Target Date</TableHead>
            <TableHead>Dependencies</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onTaskClick(task)}
            >
              <TableCell className="font-medium">{task.serialNo}</TableCell>
              <TableCell className="text-lg">{task.sentiment || "😐"}</TableCell>
              <TableCell className="max-w-xs truncate">{task.actionItem}</TableCell>
              <TableCell>{task.owner}</TableCell>
              <TableCell>
                {task.category && <Badge variant="outline">{task.category}</Badge>}
              </TableCell>
              <TableCell>
                <TaskStatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                {task.priority_score !== undefined && task.priority_score > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          task.priority_score > 70 ? 'bg-red-500' :
                          task.priority_score > 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${task.priority_score}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{task.priority_score}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>{new Date(task.targetDate).toLocaleDateString()}</TableCell>
              <TableCell>
                {task.dependencies && task.dependencies.length > 0 && (
                  <Badge variant="secondary">{task.dependencies.length}</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskTableView;
