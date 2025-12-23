import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, TaskStatus } from "@/types/task";
import { useTaskContext } from "@/contexts/TaskContext";
import { SubtaskList } from "./SubtaskList";
import { TaskDependencySelector } from "./TaskDependencySelector";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { MultiSelectWithAdd } from "./ui/multi-select-with-add";
import { SelectWithAdd } from "./ui/select-with-add";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}

const statusOptions: TaskStatus[] = ["Not Started", "In Progress", "Completed", "On Hold", "Overdue"];

export const TaskDialog = ({ open, onOpenChange, task }: TaskDialogProps) => {
  const {
    addTask,
    updateTask,
    owners,
    categories,
    addCategory,
    addOwner,
    tasks,
    getSubtasksByTaskId,
    addSubtask,
    updateSubtask,
    deleteSubtask,
  } = useTaskContext();
  const [formData, setFormData] = useState({
    owner: [] as string[],
    actionItem: "",
    reportedDate: "",
    targetDate: "",
    status: "Not Started" as TaskStatus,
    progressComments: "",
    category: "",
    dependencies: [] as string[],
  });
  const taskSubtasks = task ? getSubtasksByTaskId(task.id) : [];

  useEffect(() => {
    if (task) {
      setFormData({
        owner: task.owner,
        actionItem: task.actionItem,
        reportedDate: task.reportedDate,
        targetDate: task.targetDate,
        status: task.status,
        progressComments: task.progressComments,
        category: task.category || "",
        dependencies: task.dependencies || [],
      });
    } else {
      setFormData({
        owner: [],
        actionItem: "",
        reportedDate: new Date().toISOString().split("T")[0],
        targetDate: "",
        status: "Not Started",
        progressComments: "",
        category: "",
        dependencies: [],
      });
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task) {
      updateTask(task.id, formData);
    } else {
      addTask(formData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="subtasks" disabled={!task}>
                Subtasks {task && taskSubtasks.length > 0 && `(${taskSubtasks.length})`}
              </TabsTrigger>
              <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <MultiSelectWithAdd
              label="Owners *"
              options={owners}
              selectedValues={formData.owner}
              onValuesChange={(values) => setFormData({ ...formData, owner: values })}
              onAddNew={(name) => addOwner({ name })}
              placeholder="Select owners"
              emptyMessage="No owners yet. Add one to get started!"
            />

            <SelectWithAdd
              label="Category"
              options={categories}
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              onAddNew={addCategory}
              placeholder="Select category"
              emptyMessage="No categories yet. Add one to get started!"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actionItem">Action Item *</Label>
            <Textarea
              id="actionItem"
              value={formData.actionItem}
              onChange={(e) => setFormData({ ...formData, actionItem: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportedDate">Reported Date *</Label>
              <Input
                id="reportedDate"
                type="date"
                value={formData.reportedDate}
                onChange={(e) => setFormData({ ...formData, reportedDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Date *</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

            <div className="space-y-2">
              <Label htmlFor="progressComments">Progress Comments</Label>
              <Textarea
                id="progressComments"
                value={formData.progressComments}
                onChange={(e) => setFormData({ ...formData, progressComments: e.target.value })}
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="subtasks" className="space-y-4 mt-4">
            {task && (
              <SubtaskList
                taskId={task.id}
                subtasks={taskSubtasks}
                onAddSubtask={addSubtask}
                onUpdateSubtask={updateSubtask}
                onDeleteSubtask={deleteSubtask}
              />
            )}
          </TabsContent>

          <TabsContent value="dependencies" className="space-y-4 mt-4">
            <TaskDependencySelector
              currentTaskId={task?.id}
              selectedDependencies={formData.dependencies}
              availableTasks={tasks}
              onDependenciesChange={(dependencies) =>
                setFormData({ ...formData, dependencies })
              }
            />
          </TabsContent>
        </Tabs>

        <Separator />

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">{task ? "Update Task" : "Add Task"}</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
