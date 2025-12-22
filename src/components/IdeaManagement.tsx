import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Plus, Search, X, Eye, Filter } from "lucide-react";
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
import { Idea, Department, EvaluationStage } from "@/types/database";
import IdeaDetailModal from "./IdeaDetailModal";

interface IdeaManagementProps {
  projectId?: string;
}

const IdeaManagement: React.FC<IdeaManagementProps> = ({ projectId }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    problem_statement: "",
    proposed_solution: "",
    expected_benefits: "",
    category: "process-improvement",
    priority: "medium",
    remarks: "",
    submitting_department_id: "",
  });

  useEffect(() => {
    loadIdeas();
    loadDepartments();
  }, [projectId]);

  const loadDepartments = async () => {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error loading departments:", error);
    } else {
      setDepartments(data || []);
    }
  };

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
      remarks: "",
      submitting_department_id: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ideaData = {
      ...formData,
      project_id: projectId || null,
      // Set L1-L5 framework defaults for new ideas
      evaluation_stage: "L1" as EvaluationStage,
      stage_status: "pending",
      stage_entered_at: new Date().toISOString(),
      status: "new", // Keep for backward compatibility
      submitting_department_id: formData.submitting_department_id || null,
    };

    const { error } = await supabase.from("ideas").insert([ideaData]);

    if (error) {
      toast.error("Failed to create idea");
      console.error("Error creating idea:", error);
    } else {
      toast.success("Idea created successfully and entered L1 screening!");
      setOpen(false);
      resetForm();
      loadIdeas();
    }
  };

  const handleViewDetails = (idea: Idea) => {
    setSelectedIdea(idea);
    setDetailModalOpen(true);
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

  const getStageVariant = (stage: EvaluationStage) => {
    switch (stage) {
      case "L1":
        return "outline";
      case "L2":
        return "secondary";
      case "L3":
        return "info";
      case "L4":
        return "warning";
      case "L5":
        return "success";
      default:
        return "default";
    }
  };

  const getStageStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline";
      case "in-review":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "on-hold":
        return "secondary";
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
      const matchesStage =
        filterStage === "all" || idea.evaluation_stage === filterStage;
      const matchesDepartment =
        filterDepartment === "all" ||
        idea.submitting_department_id === filterDepartment;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority &&
        matchesStage &&
        matchesDepartment
      );
    });
  }, [
    ideas,
    searchTerm,
    filterCategory,
    filterPriority,
    filterStage,
    filterDepartment,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterPriority("all");
    setFilterStage("all");
    setFilterDepartment("all");
  };

  // Get stage statistics
  const stageStats = useMemo(() => {
    return {
      L1: ideas.filter((i) => i.evaluation_stage === "L1").length,
      L2: ideas.filter((i) => i.evaluation_stage === "L2").length,
      L3: ideas.filter((i) => i.evaluation_stage === "L3").length,
      L4: ideas.filter((i) => i.evaluation_stage === "L4").length,
      L5: ideas.filter((i) => i.evaluation_stage === "L5").length,
    };
  }, [ideas]);

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Ideation Portal</h2>
          <p className="text-muted-foreground">
            L1-L5 Evaluation Framework for Innovation Management
          </p>

          {/* Stage Statistics */}
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="text-xs">
              L1: {stageStats.L1}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              L2: {stageStats.L2}
            </Badge>
            <Badge variant="info" className="text-xs">
              L3: {stageStats.L3}
            </Badge>
            <Badge variant="warning" className="text-xs">
              L4: {stageStats.L4}
            </Badge>
            <Badge variant="success" className="text-xs">
              L5: {stageStats.L5}
            </Badge>
            <Badge className="text-xs ml-2">Total: {ideas.length}</Badge>
          </div>
        </div>

        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="blue">
              <Plus className="mr-2 h-4 w-4" />
              Submit New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit New Idea (L1 Screening)</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Idea Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Brief, descriptive title for your idea"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="submitting_department">
                  Submitting Department <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.submitting_department_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, submitting_department_id: value })
                  }
                  required
                >
                  <SelectTrigger id="submitting_department">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  placeholder="Provide a brief overview of your idea"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem_statement">
                  Problem Statement <span className="text-destructive">*</span>
                </Label>
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
                  placeholder="What problem does this idea solve? Include pain points and current challenges."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposed_solution">
                  Proposed Solution <span className="text-destructive">*</span>
                </Label>
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
                  placeholder="How will this idea address the problem? Describe your proposed approach."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_benefits">
                  Expected Benefits <span className="text-destructive">*</span>
                </Label>
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
                  placeholder="What value will this create? Consider efficiency, cost savings, quality, compliance, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Additional Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={2}
                  placeholder="Any additional context or information"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 <strong>Next Steps:</strong> Your idea will enter L1 (Initial
                  Screening) and will be routed to the appropriate reviewers for
                  evaluation.
                </p>
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
                  Submit Idea
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ideas by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="L1">L1: Screening</SelectItem>
              <SelectItem value="L2">L2: Review</SelectItem>
              <SelectItem value="L3">L3: Business</SelectItem>
              <SelectItem value="L4">L4: Executive</SelectItem>
              <SelectItem value="L5">L5: Implementation</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

          {(searchTerm ||
            filterCategory !== "all" ||
            filterPriority !== "all" ||
            filterStage !== "all" ||
            filterDepartment !== "all") && (
            <Button variant="outline" size="icon" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Ideas Table */}
      {isLoading ? (
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : filteredIdeas.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {ideas.length === 0
              ? "No ideas yet. Submit your first idea to get started!"
              : "No ideas match your current filters."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead className="min-w-[250px]">Idea Title</TableHead>
                <TableHead className="w-[100px]">Stage</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[140px]">Department</TableHead>
                <TableHead className="w-[140px]">Category</TableHead>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead className="w-[100px]">Days in Stage</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIdeas.map((idea, index) => {
                const department = departments.find(
                  (d) => d.id === idea.submitting_department_id
                );

                return (
                  <TableRow key={idea.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      #{index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      <div className="max-w-xs">
                        <p className="truncate">{idea.title}</p>
                        {idea.description && (
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {idea.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStageVariant(idea.evaluation_stage)}>
                        {idea.evaluation_stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStageStatusVariant(idea.stage_status)}>
                        {idea.stage_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {department?.code || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getCategoryVariant(idea.category)} className="text-xs">
                        {idea.category.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityVariant(idea.priority)} className="text-xs">
                        {idea.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {idea.time_in_stage_days || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(idea)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Idea Detail Modal */}
      <IdeaDetailModal
        idea={selectedIdea}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onUpdate={loadIdeas}
      />
    </div>
  );
};

export default IdeaManagement;
