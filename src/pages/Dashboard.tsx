import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaskStatusBadge } from "@/components/TaskStatusBadge";
import { TaskDialog } from "@/components/TaskDialog";
import { useTaskContext } from "@/contexts/TaskContext";
import { Task } from "@/types/task";
import { toast } from "sonner";

const Dashboard = () => {
  const { tasks, deleteTask } = useTaskContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast.success("Task deleted successfully");
  };

  const handleAddNew = () => {
    setSelectedTask(undefined);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Task Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and track your team's tasks</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No tasks yet</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first task</p>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="w-4 h-4" />
              Add First Task
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">S.No</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="min-w-[200px]">Action Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Reported Date</TableHead>
                <TableHead>Target Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="min-w-[200px]">Progress Comments</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.serialNo}</TableCell>
                  <TableCell>{task.owner}</TableCell>
                  <TableCell>{task.actionItem}</TableCell>
                  <TableCell>{task.category || "-"}</TableCell>
                  <TableCell>{new Date(task.reportedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(task.targetDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <TaskStatusBadge status={task.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {task.progressComments || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(task)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
      />
    </div>
  );
};

export default Dashboard;
