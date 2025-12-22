import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Idea, EvaluationStage } from "@/types/database";
import StageProgressIndicator from "./StageProgressIndicator";
import L2EvaluationForm from "./L2EvaluationForm";
import L3BusinessCaseForm from "./L3BusinessCaseForm";
import L4ExecutiveReviewForm from "./L4ExecutiveReviewForm";
import {
  FileText,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

interface IdeaDetailModalProps {
  idea: Idea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  open,
  onOpenChange,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingStage, setIsEditingStage] = useState(false);

  useEffect(() => {
    if (idea) {
      // Set active tab based on current stage
      setActiveTab(getDefaultTab(idea.evaluation_stage));
      setIsEditingStage(false);
    }
  }, [idea]);

  if (!idea) return null;

  const getDefaultTab = (stage: EvaluationStage) => {
    switch (stage) {
      case "L1":
        return "overview";
      case "L2":
        return "l2-review";
      case "L3":
        return "l3-business";
      case "L4":
        return "l4-executive";
      case "L5":
        return "l5-implementation";
      default:
        return "overview";
    }
  };

  const getCompletedStages = (): EvaluationStage[] => {
    const completed: EvaluationStage[] = [];
    if (idea.l2_completed_at) completed.push("L2");
    if (idea.l3_completed_at) completed.push("L3");
    if (idea.l4_completed_at && idea.l4_final_decision === "approved") {
      completed.push("L4");
    }
    if (idea.l5_completed_at) completed.push("L5");
    return completed;
  };

  const getPriorityColor = (priority: string) => {
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

  const getCategoryColor = (category: string) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{idea.title}</DialogTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant={getCategoryColor(idea.category)}>
                  {idea.category.replace("-", " ")}
                </Badge>
                <Badge variant={getPriorityColor(idea.priority)}>
                  {idea.priority} priority
                </Badge>
                <Badge variant="outline">
                  {idea.evaluation_stage} - {idea.stage_status}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Stage Progress Indicator */}
        <div className="my-6">
          <StageProgressIndicator
            currentStage={idea.evaluation_stage}
            stageStatus={idea.stage_status}
            completedStages={getCompletedStages()}
          />
        </div>

        {/* Tabs for Different Stages */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="l2-review">L2 Review</TabsTrigger>
            <TabsTrigger value="l3-business">L3 Business</TabsTrigger>
            <TabsTrigger value="l4-executive">L4 Executive</TabsTrigger>
            <TabsTrigger value="l5-implementation">L5 Implement</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Idea Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Description
                  </h4>
                  <p className="text-sm">{idea.description || "No description provided"}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                      Problem Statement
                    </h4>
                    <p className="text-sm">
                      {idea.problem_statement || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                      Proposed Solution
                    </h4>
                    <p className="text-sm">
                      {idea.proposed_solution || "Not specified"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                    Expected Benefits
                  </h4>
                  <p className="text-sm">
                    {idea.expected_benefits || "Not specified"}
                  </p>
                </div>

                {idea.remarks && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                      Remarks
                    </h4>
                    <p className="text-sm">{idea.remarks}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-semibold">
                      {format(new Date(idea.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted By</p>
                    <p className="text-sm font-semibold">
                      {idea.created_by || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Time in Stage</p>
                    <p className="text-sm font-semibold">
                      {idea.time_in_stage_days || 0} days
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Time</p>
                    <p className="text-sm font-semibold">
                      {idea.total_evaluation_days || 0} days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* L2 Review Tab */}
          <TabsContent value="l2-review" className="space-y-4">
            {!isEditingStage && idea.l2_completed_at ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        L2 Review Completed
                      </CardTitle>
                      <CardDescription>
                        Completed on {format(new Date(idea.l2_completed_at), "MMM d, yyyy 'at' h:mm a")}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingStage(true)}>
                      Edit Review
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Technical Feasibility</p>
                        <p className="text-lg font-semibold">{idea.l2_technical_feasibility?.toFixed(1)} / 5.0</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Resource Availability</p>
                        <p className="text-lg font-semibold">{idea.l2_resource_availability?.toFixed(1)} / 5.0</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Timeline Feasibility</p>
                        <p className="text-lg font-semibold">{idea.l2_timeline_feasibility?.toFixed(1)} / 5.0</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Department Fit</p>
                        <p className="text-lg font-semibold">{idea.l2_department_fit?.toFixed(1)} / 5.0</p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Overall L2 Score</p>
                      <p className="text-2xl font-bold text-success">{idea.l2_overall_score?.toFixed(2)} / 5.0</p>
                    </div>

                    {idea.l2_comments && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Reviewer Comments</h4>
                        <p className="text-sm">{idea.l2_comments}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : idea.evaluation_stage === "L2" || isEditingStage ? (
              <L2EvaluationForm
                idea={idea}
                onComplete={() => {
                  setIsEditingStage(false);
                  onUpdate();
                }}
                onCancel={() => setIsEditingStage(false)}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    L2 Review has not been completed yet. Idea must reach L2 stage first.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* L3 Business Case Tab */}
          <TabsContent value="l3-business" className="space-y-4">
            {!isEditingStage && idea.l3_completed_at ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        L3 Business Case Completed
                      </CardTitle>
                      <CardDescription>
                        Completed on {format(new Date(idea.l3_completed_at), "MMM d, yyyy 'at' h:mm a")}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingStage(true)}>
                      Edit Business Case
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Estimated Cost
                        </p>
                        <p className="text-lg font-semibold">₹{idea.l3_estimated_cost?.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Expected Savings
                        </p>
                        <p className="text-lg font-semibold">₹{idea.l3_expected_savings?.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p className={`text-lg font-semibold ${(idea.l3_roi_percentage || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {idea.l3_roi_percentage?.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Payback Period
                        </p>
                        <p className="text-lg font-semibold">{idea.l3_payback_period_months} months</p>
                      </div>
                    </div>

                    {(idea.l3_capex !== undefined || idea.l3_opex !== undefined) && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">CAPEX</p>
                          <p className="text-sm font-semibold">₹{idea.l3_capex?.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">OPEX</p>
                          <p className="text-sm font-semibold">₹{idea.l3_opex?.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    )}

                    {idea.l3_headcount_impact !== undefined && idea.l3_headcount_impact !== 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Headcount Impact
                        </p>
                        <p className="text-sm font-semibold">
                          {idea.l3_headcount_impact > 0 ? '+' : ''}{idea.l3_headcount_impact} FTE
                        </p>
                      </div>
                    )}

                    {idea.l3_business_case_document && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Business Case</h4>
                        <p className="text-sm whitespace-pre-wrap">{idea.l3_business_case_document}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : idea.evaluation_stage === "L3" || (idea.evaluation_stage === "L4" && !idea.l3_completed_at) || isEditingStage ? (
              <L3BusinessCaseForm
                idea={idea}
                onComplete={() => {
                  setIsEditingStage(false);
                  onUpdate();
                }}
                onCancel={() => setIsEditingStage(false)}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    L3 Business Case has not been completed yet. Idea must reach L3 stage first.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* L4 Executive Review Tab */}
          <TabsContent value="l4-executive" className="space-y-4">
            {!isEditingStage && idea.l4_completed_at ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {idea.l4_final_decision === "approved" ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-warning" />
                        )}
                        L4 Executive Review Completed
                      </CardTitle>
                      <CardDescription>
                        Decision: <span className="font-semibold">{idea.l4_final_decision?.toUpperCase()}</span> on{" "}
                        {format(new Date(idea.l4_completed_at), "MMM d, yyyy 'at' h:mm a")}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditingStage(true)}>
                      Edit Review
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Strategic Alignment</p>
                        <p className="text-lg font-semibold">{idea.l4_strategic_alignment?.toFixed(1)} / 5.0</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Portfolio Fit</p>
                        <p className="text-lg font-semibold">{idea.l4_portfolio_fit?.toFixed(1)} / 5.0</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Risk Level</p>
                        <Badge variant={
                          idea.l4_risk_level === "low" ? "success" :
                          idea.l4_risk_level === "medium" ? "warning" : "destructive"
                        }>
                          {idea.l4_risk_level?.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Approved Budget</p>
                        <p className="text-lg font-semibold">₹{idea.l4_approved_budget?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {idea.l4_executive_comments && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Executive Comments</h4>
                        <p className="text-sm whitespace-pre-wrap">{idea.l4_executive_comments}</p>
                      </div>
                    )}

                    {idea.l4_conditions && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Conditions</h4>
                        <p className="text-sm whitespace-pre-wrap">{idea.l4_conditions}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : idea.evaluation_stage === "L4" || isEditingStage ? (
              <L4ExecutiveReviewForm
                idea={idea}
                onComplete={() => {
                  setIsEditingStage(false);
                  onUpdate();
                }}
                onCancel={() => setIsEditingStage(false)}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    L4 Executive Review has not been started yet. Idea must reach L4 stage first.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* L5 Implementation Tab */}
          <TabsContent value="l5-implementation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  L5: Implementation Tracking
                </CardTitle>
                <CardDescription>
                  Track implementation progress and measure actual vs. expected results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {idea.evaluation_stage === "L5" ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Implementation tracking interface coming soon...
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Project ID: {idea.l5_converted_to_project_id || "Not yet converted"}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Idea must be approved at L4 to enter implementation phase.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Idea History & Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Stage transition history will be displayed here...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaDetailModal;
