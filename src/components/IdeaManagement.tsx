import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
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
    setIsLoading(true);
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
    setIsLoading(false);
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

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesSearch = idea.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || idea.category === filterCategory;
      const matchesPriority =
        filterPriority === "all" || idea.priority === filterPriority;
      const matchesStatus =
        filterStatus === "all" || idea.status === filterStatus;

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [ideas, searchTerm, filterCategory, filterPriority, filterStatus]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterPriority("all");
    setFilterStatus("all");
  };

  // Selection handlers
  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredIdeas.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredIdeas.map((idea) => idea.id)));
    }
  };

  // Bulk action handlers
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} idea(s)?`))
      return;

    const { error } = await supabase
      .from("ideas")
      .delete()
      .in("id", Array.from(selectedIds));

    if (error) {
      toast.error("Failed to delete ideas");
      console.error("Error deleting ideas:", error);
    } else {
      toast.success(`Successfully deleted ${selectedIds.size} idea(s)!`);
      setSelectedIds(new Set());
      loadIdeas();
    }
  };

  const handleBulkUpdateStatus = async (status: string) => {
    if (selectedIds.size === 0) return;

    const { error } = await supabase
      .from("ideas")
      .update({ status })
      .in("id", Array.from(selectedIds));

    if (error) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    } else {
      toast.success(`Successfully updated ${selectedIds.size} idea(s)!`);
      setSelectedIds(new Set());
      loadIdeas();
    }
  };

  const handleBulkUpdatePriority = async (priority: string) => {
    if (selectedIds.size === 0) return;

    const { error } = await supabase
      .from("ideas")
      .update({ priority })
      .in("id", Array.from(selectedIds));

    if (error) {
      toast.error("Failed to update priority");
      console.error("Error updating priority:", error);
    } else {
      toast.success(`Successfully updated ${selectedIds.size} idea(s)!`);
      setSelectedIds(new Set());
      loadIdeas();
    }
  };

  const handleBulkUpdateCategory = async (category: string) => {
    if (selectedIds.size === 0) return;

    const { error } = await supabase
      .from("ideas")
      .update({ category })
      .in("id", Array.from(selectedIds));

    if (error) {
      toast.error("Failed to update category");
      console.error("Error updating category:", error);
    } else {
      toast.success(`Successfully updated ${selectedIds.size} idea(s)!`);
      setSelectedIds(new Set());
      loadIdeas();
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
            <Button>
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
                <Button type="submit">
                  {editingIdea ? "Update Idea" : "Create Idea"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="process-improvement">
                Process Improvement
              </SelectItem>
              <SelectItem value="cost-reduction">Cost Reduction</SelectItem>
              <SelectItem value="innovation">Innovation</SelectItem>
              <SelectItem value="quality">Quality</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="implemented">Implemented</SelectItem>
            </SelectContent>
          </Select>

      {(searchTerm ||
        filterCategory !== "all" ||
        filterPriority !== "all" ||
        filterStatus !== "all") && (
        <Button variant="outline" size="icon" onClick={clearFilters}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  </div>

  {selectedIds.size > 0 && (
    <div className="flex items-center justify-between p-4 bg-accent rounded-lg border border-border">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-accent-foreground">
          {selectedIds.size} idea(s) selected
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedIds(new Set())}
        >
          Deselect All
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Select onValueChange={handleBulkUpdateCategory}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Change Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="process-improvement">
              Process Improvement
            </SelectItem>
            <SelectItem value="cost-reduction">Cost Reduction</SelectItem>
            <SelectItem value="innovation">Innovation</SelectItem>
            <SelectItem value="quality">Quality</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleBulkUpdatePriority}>
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="Change Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleBulkUpdateStatus}>
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="Change Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="implemented">Implemented</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected
        </Button>
      </div>
    </div>
  )}

  {isLoading ? (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  ) : filteredIdeas.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">
            {ideas.length === 0
              ? "No ideas yet. Create your first idea to get started!"
              : "No ideas match your current filters."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      filteredIdeas.length > 0 &&
                      selectedIds.size === filteredIdeas.length
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-16">Sl.No</TableHead>
                <TableHead className="min-w-[200px]">Idea Title</TableHead>
                <TableHead className="min-w-[250px]">Problem Statement</TableHead>
                <TableHead className="min-w-[250px]">Proposed Solution</TableHead>
                <TableHead className="min-w-[250px]">Expected Benefits</TableHead>
                <TableHead className="w-[140px]">Category</TableHead>
                <TableHead className="w-[200px]">Idea Owner</TableHead>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="min-w-[200px]">Remarks</TableHead>
                <TableHead className="w-[180px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIdeas.map((idea) => (
                <TableRow
                  key={idea.id}
                  className={
                    selectedIds.has(idea.id) ? "bg-accent/50" : undefined
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(idea.id)}
                      onCheckedChange={() => handleSelectOne(idea.id)}
                      aria-label={`Select ${idea.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {ideas.findIndex((i) => i.id === idea.id) + 1}
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
                  <TableCell className="text-muted-foreground text-xs">
                    {idea.created_by || "Unknown"}
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
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(idea)}
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(idea.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
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
