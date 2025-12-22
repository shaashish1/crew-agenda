import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  Eye, 
  Lightbulb, 
  Filter,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Rocket
} from "lucide-react";
import { format } from "date-fns";
import { EnhancedIdea, Department, EvaluationStage, StageStatistics } from "@/types/ideation";
import { IdeaSubmissionForm } from "./IdeaSubmissionForm";
import { IdeaDetailModal } from "./IdeaDetailModal";
import { StageProgressIndicator } from "./StageProgressIndicator";

interface AIIdeationPortalProps {
  projectId?: string;
}

const stageLabels: Record<EvaluationStage, { label: string; description: string; icon: React.ReactNode }> = {
  L1: { label: 'L1 Submission', description: 'Initial ideas', icon: <Lightbulb className="h-5 w-5" /> },
  L2: { label: 'L2 Screening', description: 'Under review', icon: <Filter className="h-5 w-5" /> },
  L3: { label: 'L3 Feasibility', description: 'Assessment', icon: <TrendingUp className="h-5 w-5" /> },
  L4: { label: 'L4 Business Case', description: 'ROI analysis', icon: <CheckCircle2 className="h-5 w-5" /> },
  L5: { label: 'L5 Implementation', description: 'In progress', icon: <Rocket className="h-5 w-5" /> },
};

export function AIIdeationPortal({ projectId }: AIIdeationPortalProps) {
  const [ideas, setIdeas] = useState<EnhancedIdea[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<EnhancedIdea | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([loadIdeas(), loadDepartments()]);
    setIsLoading(false);
  };

  const loadIdeas = async () => {
    let query = supabase
      .from("ideas")
      .select("*, departments(*)")
      .order("created_at", { ascending: false });

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error loading ideas:", error);
      toast.error("Failed to load ideas");
    } else {
      const mappedIdeas = (data || []).map((item: any) => ({
        ...item,
        department: item.departments,
        evaluation_stage: item.evaluation_stage || 'L1',
        stage_status: item.stage_status || 'pending',
      }));
      setIdeas(mappedIdeas);
    }
  };

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

  const stageStatistics = useMemo((): StageStatistics[] => {
    const stages: EvaluationStage[] = ['L1', 'L2', 'L3', 'L4', 'L5'];
    return stages.map((stage) => {
      const stageIdeas = ideas.filter((i) => i.evaluation_stage === stage);
      return {
        stage,
        total: stageIdeas.length,
        pending: stageIdeas.filter((i) => i.stage_status === 'pending').length,
        in_progress: stageIdeas.filter((i) => i.stage_status === 'in_progress').length,
        approved: stageIdeas.filter((i) => i.stage_status === 'approved').length,
        rejected: stageIdeas.filter((i) => i.stage_status === 'rejected').length,
      };
    });
  }, [ideas]);

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.submitter_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = filterStage === "all" || idea.evaluation_stage === filterStage;
      const matchesDepartment = filterDepartment === "all" || idea.department_id === filterDepartment;
      const matchesStatus = filterStatus === "all" || idea.stage_status === filterStatus;

      return matchesSearch && matchesStage && matchesDepartment && matchesStatus;
    });
  }, [ideas, searchTerm, filterStage, filterDepartment, filterStatus]);

  const handleViewIdea = (idea: EnhancedIdea) => {
    setSelectedIdea(idea);
    setDetailModalOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'in_progress':
        return 'info';
      case 'on_hold':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Lightbulb className="h-8 w-8 text-primary" />
            AI Ideation Portal
          </h1>
          <p className="text-muted-foreground mt-1">
            Submit, track, and manage innovative ideas through the L1-L5 evaluation pipeline
          </p>
        </div>
        
        <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Submit New Idea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <IdeaSubmissionForm
              projectId={projectId}
              onSuccess={() => {
                setSubmitDialogOpen(false);
                loadIdeas();
              }}
              onCancel={() => setSubmitDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stage Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stageStatistics.map((stat) => (
          <Card 
            key={stat.stage} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              filterStage === stat.stage ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setFilterStage(filterStage === stat.stage ? 'all' : stat.stage)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{stageLabels[stat.stage].icon}</span>
                <Badge variant="outline" className="text-lg font-bold">
                  {stat.total}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-sm">{stageLabels[stat.stage].label}</CardTitle>
              <p className="text-xs text-muted-foreground">{stageLabels[stat.stage].description}</p>
              <div className="flex gap-2 mt-2">
                {stat.pending > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {stat.pending}
                  </Badge>
                )}
                {stat.approved > 0 && (
                  <Badge variant="success" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {stat.approved}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger>
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="L1">L1 - Submission</SelectItem>
                <SelectItem value="L2">L2 - Screening</SelectItem>
                <SelectItem value="L3">L3 - Feasibility</SelectItem>
                <SelectItem value="L4">L4 - Business Case</SelectItem>
                <SelectItem value="L5">L5 - Implementation</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ideas Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No ideas found</h3>
              <p className="text-muted-foreground">
                {ideas.length === 0 
                  ? "Submit your first idea to get started!" 
                  : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Submitter</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIdeas.map((idea, index) => (
                  <TableRow key={idea.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{idea.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {idea.description || idea.problem_statement}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-foreground">
                        {idea.submitter_name || "Anonymous"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {idea.department?.code || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {idea.evaluation_stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(idea.stage_status)}>
                        {idea.stage_status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(idea.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewIdea(idea)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <IdeaDetailModal
        idea={selectedIdea}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onUpdate={() => {
          loadIdeas();
          setDetailModalOpen(false);
        }}
      />
    </div>
  );
}
