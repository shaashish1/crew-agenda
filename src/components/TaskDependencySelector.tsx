import { Task } from "@/types/task";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "./ui/alert";

interface TaskDependencySelectorProps {
  currentTaskId?: string;
  selectedDependencies: string[];
  availableTasks: Task[];
  onDependenciesChange: (dependencies: string[]) => void;
}

export const TaskDependencySelector = ({
  currentTaskId,
  selectedDependencies,
  availableTasks,
  onDependenciesChange,
}: TaskDependencySelectorProps) => {
  const detectCircularDependency = (taskId: string, depId: string, tasks: Task[]): boolean => {
    if (taskId === depId) return true;
    
    const visited = new Set<string>();
    const checkCycle = (currentId: string): boolean => {
      if (currentId === taskId) return true;
      if (visited.has(currentId)) return false;
      
      visited.add(currentId);
      const task = tasks.find(t => t.id === currentId);
      if (!task?.dependencies) return false;
      
      return task.dependencies.some(dep => checkCycle(dep));
    };
    
    return checkCycle(depId);
  };

  const handleToggleDependency = (taskId: string) => {
    const isSelected = selectedDependencies.includes(taskId);
    
    if (isSelected) {
      onDependenciesChange(selectedDependencies.filter(id => id !== taskId));
    } else {
      // Check for circular dependency
      if (currentTaskId && detectCircularDependency(currentTaskId, taskId, availableTasks)) {
        return; // Don't add if it creates a cycle
      }
      onDependenciesChange([...selectedDependencies, taskId]);
    }
  };

  const handleRemoveDependency = (taskId: string) => {
    onDependenciesChange(selectedDependencies.filter(id => id !== taskId));
  };

  const getTaskById = (id: string) => availableTasks.find(t => t.id === id);

  const hasCircularWarning = (taskId: string): boolean => {
    return currentTaskId ? detectCircularDependency(currentTaskId, taskId, availableTasks) : false;
  };

  const filteredTasks = availableTasks.filter(task => task.id !== currentTaskId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Dependencies</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Add Dependency
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="end">
            <Command>
              <CommandInput placeholder="Search tasks..." />
              <CommandList>
                <CommandEmpty>No tasks found.</CommandEmpty>
                <CommandGroup>
                  {filteredTasks.map((task) => {
                    const isSelected = selectedDependencies.includes(task.id);
                    const hasCircular = hasCircularWarning(task.id);
                    
                    return (
                      <CommandItem
                        key={task.id}
                        onSelect={() => handleToggleDependency(task.id)}
                        disabled={hasCircular}
                        className={cn(hasCircular && "opacity-50")}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50"
                            )}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              #{task.serialNo} {task.actionItem}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {task.status}
                            </div>
                          </div>
                          {hasCircular && (
                            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedDependencies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedDependencies.map((depId) => {
            const task = getTaskById(depId);
            if (!task) return null;
            
            return (
              <Badge
                key={depId}
                variant="secondary"
                className="pl-3 pr-1 py-1 gap-1 max-w-[200px]"
              >
                <span className="truncate text-xs">
                  #{task.serialNo} {task.actionItem}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveDependency(depId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}

      {selectedDependencies.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No dependencies added. This task can start immediately.
        </p>
      )}
    </div>
  );
};
