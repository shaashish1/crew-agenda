import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, TaskStatus } from "@/types/task";
import { useTaskContext } from "@/contexts/TaskContext";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { SubtaskList } from "./SubtaskList";
import { TaskDependencySelector } from "./TaskDependencySelector";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
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
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
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
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If creating a new category, add it first
    let finalCategory = formData.category;
    if (isCreatingNewCategory && newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      finalCategory = newCategoryName.trim();
    }
    
    const finalFormData = { ...formData, category: finalCategory };
    
    if (task) {
      updateTask(task.id, finalFormData);
    } else {
      addTask(finalFormData);
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
            <div className="space-y-2">
              <Label htmlFor="owner">Owners *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.owner.length > 0 ? (
                      <span className="flex gap-1 flex-wrap">
                        {formData.owner.slice(0, 2).map(owner => (
                          <Badge key={owner} variant="secondary" className="text-xs">
                            {owner}
                            <X 
                              className="ml-1 h-3 w-3 cursor-pointer" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData({ 
                                  ...formData, 
                                  owner: formData.owner.filter(o => o !== owner) 
                                });
                              }}
                            />
                          </Badge>
                        ))}
                        {formData.owner.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{formData.owner.length - 2}
                          </Badge>
                        )}
                      </span>
                    ) : (
                      "Select owners"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {owners.map(owner => (
                      <div key={owner.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`owner-${owner.id}`}
                          checked={formData.owner.includes(owner.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ 
                                ...formData, 
                                owner: [...formData.owner, owner.name] 
                              });
                            } else {
                              setFormData({ 
                                ...formData, 
                                owner: formData.owner.filter(o => o !== owner.name) 
                              });
                            }
                          }}
                        />
                        <label
                          htmlFor={`owner-${owner.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {owner.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {isCreatingNewCategory ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter new category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsCreatingNewCategory(false);
                      setNewCategoryName("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => {
                    if (value === "__create_new__") {
                      setIsCreatingNewCategory(true);
                      setFormData({ ...formData, category: "" });
                    } else {
                      setFormData({ ...formData, category: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__create_new__">
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Create New Category</span>
                      </div>
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
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
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit">{task ? "Update Task" : "Add Task"}</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
