import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Idea, RiskLevel, FinalDecision } from "@/types/database";
import { Shield, Target, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";

interface L4ExecutiveReviewFormProps {
  idea: Idea;
  onComplete: () => void;
  onCancel: () => void;
}

const L4ExecutiveReviewForm: React.FC<L4ExecutiveReviewFormProps> = ({
  idea,
  onComplete,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    strategic_alignment: idea.l4_strategic_alignment || 3,
    portfolio_fit: idea.l4_portfolio_fit || 3,
    risk_level: (idea.l4_risk_level as RiskLevel) || "medium",
    final_decision: (idea.l4_final_decision as FinalDecision) || "pending",
    executive_comments: idea.l4_executive_comments || "",
    approved_budget: idea.l4_approved_budget || idea.l3_estimated_cost || 0,
    conditions: idea.l4_conditions || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const overallExecutiveScore = (formData.strategic_alignment + formData.portfolio_fit) / 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.final_decision === "pending") {
      toast.error("Please select a final decision (Approve/Reject/On-Hold)");
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: any = {
        l4_strategic_alignment: formData.strategic_alignment,
        l4_portfolio_fit: formData.portfolio_fit,
        l4_risk_level: formData.risk_level,
        l4_final_decision: formData.final_decision,
        l4_executive_comments: formData.executive_comments,
        l4_approved_budget: formData.approved_budget,
        l4_conditions: formData.conditions,
        l4_completed_at: new Date().toISOString(),
        l4_approved_by: idea.created_by, // TODO: Replace with actual user ID
      };

      // If approved, move to L5 stage
      if (formData.final_decision === "approved") {
        updateData.evaluation_stage = "L5";
        updateData.stage_status = "pending";
      } else if (formData.final_decision === "rejected") {
        updateData.stage_status = "rejected";
      } else if (formData.final_decision === "on-hold") {
        updateData.stage_status = "on-hold";
      }

      const { error } = await supabase
        .from("ideas")
        .update(updateData)
        .eq("id", idea.id);

      if (error) throw error;

      toast.success(
        formData.final_decision === "approved"
          ? "Idea approved and moved to L5 Implementation!"
          : `L4 executive review completed with decision: ${formData.final_decision}`
      );
      onComplete();
    } catch (error) {
      console.error("Error submitting L4 review:", error);
      toast.error("Failed to submit executive review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDecisionIcon = (decision: FinalDecision) => {
    switch (decision) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "on-hold":
        return <Clock className="h-5 w-5 text-warning" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "low":
        return "text-success";
      case "medium":
        return "text-warning";
      case "high":
        return "text-destructive";
      case "critical":
        return "text-destructive font-bold";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>L4: Executive Review & Approval</CardTitle>
          <CardDescription>
            Strategic assessment and final Go/No-Go decision
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* L3 Business Case Summary */}
          {idea.l3_estimated_cost && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3">L3 Business Case Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Estimated Cost</p>
                    <p className="font-semibold">₹{idea.l3_estimated_cost?.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expected Savings</p>
                    <p className="font-semibold">₹{idea.l3_expected_savings?.toLocaleString('en-IN')}/yr</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ROI</p>
                    <p className={`font-semibold ${(idea.l3_roi_percentage || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {idea.l3_roi_percentage?.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payback</p>
                    <p className="font-semibold">{idea.l3_payback_period_months} months</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Strategic Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Strategic Assessment
            </h3>

            {/* Strategic Alignment */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Strategic Alignment</Label>
                <span className="text-sm font-semibold">
                  {formData.strategic_alignment.toFixed(1)} / 5.0
                </span>
              </div>
              <Slider
                value={[formData.strategic_alignment]}
                onValueChange={(values) =>
                  setFormData({ ...formData, strategic_alignment: values[0] })
                }
                min={0}
                max={5}
                step={0.5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                How well does this align with organizational strategy and long-term goals?
              </p>
            </div>

            {/* Portfolio Fit */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Portfolio Fit</Label>
                <span className="text-sm font-semibold">
                  {formData.portfolio_fit.toFixed(1)} / 5.0
                </span>
              </div>
              <Slider
                value={[formData.portfolio_fit]}
                onValueChange={(values) =>
                  setFormData({ ...formData, portfolio_fit: values[0] })
                }
                min={0}
                max={5}
                step={0.5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Does this fit with the current portfolio and resource allocation?
              </p>
            </div>

            {/* Overall Executive Score */}
            <Card className="bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Executive Score</p>
                    <p className={`text-2xl font-bold ${overallExecutiveScore >= 3.5 ? 'text-success' : overallExecutiveScore >= 2.5 ? 'text-warning' : 'text-destructive'}`}>
                      {overallExecutiveScore.toFixed(2)} / 5.0
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Assessment
            </h3>

            <div className="space-y-2">
              <Label>Overall Risk Level</Label>
              <RadioGroup
                value={formData.risk_level}
                onValueChange={(value) =>
                  setFormData({ ...formData, risk_level: value as RiskLevel })
                }
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="low" id="risk-low" />
                  <Label htmlFor="risk-low" className="cursor-pointer">
                    <span className="text-success font-semibold">Low Risk</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="medium" id="risk-medium" />
                  <Label htmlFor="risk-medium" className="cursor-pointer">
                    <span className="text-warning font-semibold">Medium Risk</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="high" id="risk-high" />
                  <Label htmlFor="risk-high" className="cursor-pointer">
                    <span className="text-destructive font-semibold">High Risk</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="critical" id="risk-critical" />
                  <Label htmlFor="risk-critical" className="cursor-pointer">
                    <span className="text-destructive font-bold">Critical Risk</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Budget Approval */}
          <div className="space-y-2">
            <Label htmlFor="approved-budget">
              Approved Budget (INR) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="approved-budget"
              type="number"
              min="0"
              step="1000"
              value={formData.approved_budget}
              onChange={(e) =>
                setFormData({ ...formData, approved_budget: parseFloat(e.target.value) || 0 })
              }
              required
            />
            {idea.l3_estimated_cost && formData.approved_budget !== idea.l3_estimated_cost && (
              <p className="text-xs text-warning">
                ⚠ Approved budget differs from L3 estimate (₹{idea.l3_estimated_cost.toLocaleString('en-IN')})
              </p>
            )}
          </div>

          {/* Final Decision */}
          <div className="space-y-4">
            <Label>Final Decision <span className="text-destructive">*</span></Label>
            <RadioGroup
              value={formData.final_decision}
              onValueChange={(value) =>
                setFormData({ ...formData, final_decision: value as FinalDecision })
              }
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card className={`cursor-pointer transition-all ${formData.final_decision === 'approved' ? 'ring-2 ring-success' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="approved" id="decision-approved" />
                    <Label htmlFor="decision-approved" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <span className="font-semibold text-success">Approve</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Proceed to L5 Implementation
                      </p>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all ${formData.final_decision === 'on-hold' ? 'ring-2 ring-warning' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="on-hold" id="decision-hold" />
                    <Label htmlFor="decision-hold" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-warning" />
                        <span className="font-semibold text-warning">On Hold</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Defer decision pending more info
                      </p>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-all ${formData.final_decision === 'rejected' ? 'ring-2 ring-destructive' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rejected" id="decision-rejected" />
                    <Label htmlFor="decision-rejected" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-destructive" />
                        <span className="font-semibold text-destructive">Reject</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Do not proceed with implementation
                      </p>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </RadioGroup>
          </div>

          {/* Executive Comments */}
          <div className="space-y-2">
            <Label htmlFor="executive-comments">
              Executive Comments <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="executive-comments"
              value={formData.executive_comments}
              onChange={(e) =>
                setFormData({ ...formData, executive_comments: e.target.value })
              }
              rows={4}
              placeholder="Provide rationale for decision, strategic considerations, and any conditions..."
              required
            />
          </div>

          {/* Conditions (if applicable) */}
          {(formData.final_decision === "approved" || formData.final_decision === "on-hold") && (
            <div className="space-y-2">
              <Label htmlFor="conditions">
                Conditions / Prerequisites {formData.final_decision === "approved" && "(Optional)"}
              </Label>
              <Textarea
                id="conditions"
                value={formData.conditions}
                onChange={(e) =>
                  setFormData({ ...formData, conditions: e.target.value })
                }
                rows={3}
                placeholder="List any conditions or prerequisites that must be met before/during implementation..."
              />
            </div>
          )}

          {/* Decision Summary */}
          <Card className={`border-2 ${
            formData.final_decision === 'approved' ? 'border-success bg-success/5' :
            formData.final_decision === 'rejected' ? 'border-destructive bg-destructive/5' :
            formData.final_decision === 'on-hold' ? 'border-warning bg-warning/5' :
            'border-border'
          }`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                {getDecisionIcon(formData.final_decision)}
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Decision Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Decision:</strong> {formData.final_decision.replace("-", " ").toUpperCase()}</p>
                    <p><strong>Strategic Score:</strong> {overallExecutiveScore.toFixed(2)} / 5.0</p>
                    <p><strong>Risk Level:</strong> <span className={getRiskColor(formData.risk_level)}>{formData.risk_level.toUpperCase()}</span></p>
                    <p><strong>Approved Budget:</strong> ₹{formData.approved_budget.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant={formData.final_decision === "approved" ? "default" : formData.final_decision === "rejected" ? "destructive" : "blue"}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Executive Decision"}
        </Button>
      </div>
    </form>
  );
};

export default L4ExecutiveReviewForm;
