import { useState } from "react";
import { Subtask } from "@/types/subtask";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Trash2, Plus, GripVertical, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface SubtaskListProps {
  taskId: string;
  subtasks: Subtask[];
  onAddSubtask: (subtask: Omit<Subtask, "id" | "created_at" | "updated_at">) => void;
  onUpdateSubtask: (id: string, subtask: Partial<Subtask>) => void;
  onDeleteSubtask: (id: string) => void;
}

export const SubtaskList = ({
  taskId,
  subtasks,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
}: SubtaskListProps) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      onAddSubtask({
        parent_task_id: taskId,
        title: newSubtaskTitle,
        status: "Not Started",
        owner: [],
        order_index: subtasks.length,
      });
      setNewSubtaskTitle("");
      setIsAdding(false);
    }
  };

  const completedCount = subtasks.filter(st => st.status === "Completed").length;
  const totalCount = subtasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold">Subtasks</h3>
          {totalCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {completedCount}/{totalCount} completed
            </Badge>
          )}
        </div>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Subtask
          </Button>
        )}
      </div>

      {totalCount > 0 && (
        <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      <div className="space-y-2">
        {subtasks
          .sort((a, b) => a.order_index - b.order_index)
          .map((subtask) => (
            <div
              key={subtask.id}
              className="group flex items-start gap-2 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors backdrop-blur-sm"
            >
              <button
                className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Drag to reorder"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </button>
              
              <button
                onClick={() =>
                  onUpdateSubtask(subtask.id, {
                    status: subtask.status === "Completed" ? "In Progress" : "Completed",
                    completion_date:
                      subtask.status === "Completed" ? undefined : new Date().toISOString(),
                  })
                }
                className="mt-1 flex-shrink-0"
              >
                {subtask.status === "Completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              <div className="flex-1 min-w-0 space-y-2">
                <Input
                  value={subtask.title}
                  onChange={(e) => onUpdateSubtask(subtask.id, { title: e.target.value })}
                  className={cn(
                    "h-8 bg-transparent border-none focus-visible:ring-1 px-0",
                    subtask.status === "Completed" && "line-through text-muted-foreground"
                  )}
                />
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Select
                    value={subtask.status}
                    onValueChange={(value) => onUpdateSubtask(subtask.id, { status: value })}
                  >
                    <SelectTrigger className="h-7 w-32 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>

                  {subtask.target_date && (
                    <span className="text-xs text-muted-foreground">
                      Due: {new Date(subtask.target_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteSubtask(subtask.id)}
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
      </div>

      {isAdding && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/20 backdrop-blur-sm">
          <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <Input
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            placeholder="Subtask title..."
            className="h-8"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddSubtask();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewSubtaskTitle("");
              }
            }}
          />
          <Button onClick={handleAddSubtask} size="sm" className="h-8">
            Add
          </Button>
          <Button
            onClick={() => {
              setIsAdding(false);
              setNewSubtaskTitle("");
            }}
            variant="ghost"
            size="sm"
            className="h-8"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
