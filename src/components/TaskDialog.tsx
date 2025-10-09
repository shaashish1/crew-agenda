import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, TaskStatus } from "@/types/task";
import { useTaskContext } from "@/contexts/TaskContext";
import { Plus } from "lucide-react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
}

const statusOptions: TaskStatus[] = ["Not Started", "In Progress", "Completed", "On Hold", "Overdue"];

export const TaskDialog = ({ open, onOpenChange, task }: TaskDialogProps) => {
  const { addTask, updateTask, owners, categories, addCategory } = useTaskContext();
  const [formData, setFormData] = useState({
    owner: "",
    actionItem: "",
    reportedDate: "",
    targetDate: "",
    status: "Not Started" as TaskStatus,
    progressComments: "",
    category: "",
  });
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

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
      });
      setIsCreatingNewCategory(false);
      setNewCategoryName("");
    } else {
      setFormData({
        owner: "",
        actionItem: "",
        reportedDate: new Date().toISOString().split("T")[0],
        targetDate: "",
        status: "Not Started",
        progressComments: "",
        category: "",
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Owner *</Label>
              <Select value={formData.owner} onValueChange={(value) => setFormData({ ...formData, owner: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.name}>
                      {owner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
