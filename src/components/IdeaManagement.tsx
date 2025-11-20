import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Idea } from "@/types/database";

interface IdeaManagementProps {
  projectId?: string;
}

const IdeaManagement: React.FC<IdeaManagementProps> = ({ projectId }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [open, setOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem_statement: "",
    proposed_solution: "",
    expected_benefits: "",
    category: "process-improvement",
    priority: "medium",
    status: "new",
    remarks: "",
  });

  useEffect(() => {
    loadIdeas();
  }, [projectId]);

  const loadIdeas = async () => {
    const query = supabase.from("ideas").select("*");
    if (projectId) {
      query.eq("project_id", projectId);
    }
    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load ideas");
      console.error("Error loading ideas:", error);
    } else {
      setIdeas(data || []);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      problem_statement: "",
      proposed_solution: "",
      expected_benefits: "",
      category: "process-improvement",
      priority: "medium",
      status: "new",
      remarks: "",
    });
    setEditingIdea(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingIdea) {
      const { error } = await supabase
        .from("ideas")
        .update(formData)
        .eq("id", editingIdea.id);

      if (error) {
        toast.error("Failed to update idea");
        console.error("Error updating idea:", error);
      } else {
        toast.success("Idea updated successfully!");
        setOpen(false);
        resetForm();
        loadIdeas();
      }
    } else {
      const { error } = await supabase.from("ideas").insert([{
        ...formData,
        project_id: projectId || null
      }]);

      if (error) {
        toast.error("Failed to create idea");
        console.error("Error creating idea:", error);
      } else {
        toast.success("Idea created successfully!");
        setOpen(false);
        resetForm();
        loadIdeas();
      }
    }
  };

  const handleEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title,
      description: idea.description || "",
      problem_statement: idea.problem_statement || "",
      proposed_solution: idea.proposed_solution || "",
      expected_benefits: idea.expected_benefits || "",
      category: idea.category,
      priority: idea.priority,
      status: idea.status,
      remarks: idea.remarks || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this idea?")) return;

    const { error } = await supabase.from("ideas").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete idea");
      console.error("Error deleting idea:", error);
    } else {
      toast.success("Idea deleted successfully!");
      loadIdeas();
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case "process-improvement":
        return "info";
      case "cost-reduction":
        return "success";
      case "innovation":
        return "default";
      case "quality":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "new":
        return "outline";
      case "under-review":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "implemented":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Ideas</h2>
          <p className="text-muted-foreground">
            Manage and track innovative ideas
          </p>
        </div>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="blue">
              <Plus className="mr-2 h-4 w-4" />
              Add New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingIdea ? "Edit Idea" : "Add New Idea"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Idea Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem_statement">Problem Statement</Label>
                <Textarea
                  id="problem_statement"
                  value={formData.problem_statement}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      problem_statement: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="What problem does this idea solve?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposed_solution">Proposed Solution</Label>
                <Textarea
                  id="proposed_solution"
                  value={formData.proposed_solution}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      proposed_solution: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="How will this idea be implemented?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_benefits">Expected Benefits</Label>
                <Textarea
                  id="expected_benefits"
                  value={formData.expected_benefits}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expected_benefits: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="What are the anticipated outcomes?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="process-improvement">
                        Process Improvement
                      </SelectItem>
                      <SelectItem value="cost-reduction">
                        Cost Reduction
                      </SelectItem>
                      <SelectItem value="innovation">Innovation</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="implemented">Implemented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={2}
                  placeholder="Additional notes or comments"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="blue">
                  {editingIdea ? "Update Idea" : "Create Idea"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">
            No ideas yet. Create your first idea to get started!
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Sl.No</TableHead>
                <TableHead className="min-w-[200px]">Idea Title</TableHead>
                <TableHead className="min-w-[250px]">Problem Statement</TableHead>
                <TableHead className="min-w-[250px]">Proposed Solution</TableHead>
                <TableHead className="min-w-[250px]">Expected Benefits</TableHead>
                <TableHead className="w-[140px]">Category</TableHead>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="min-w-[200px]">Remarks</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ideas.map((idea, index) => (
                <TableRow key={idea.id}>
                  <TableCell className="font-medium text-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {idea.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {idea.problem_statement || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {idea.proposed_solution || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {idea.expected_benefits || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getCategoryVariant(idea.category)}>
                      {idea.category.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(idea.priority)}>
                      {idea.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(idea.status)}>
                      {idea.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {idea.remarks || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(idea)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(idea.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default IdeaManagement;
