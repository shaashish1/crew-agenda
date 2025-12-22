import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Idea } from "@/types/database";
import { DollarSign, TrendingUp, Calendar, Users } from "lucide-react";

interface L3BusinessCaseFormProps {
  idea: Idea;
  onComplete: () => void;
  onCancel: () => void;
}

const L3BusinessCaseForm: React.FC<L3BusinessCaseFormProps> = ({
  idea,
  onComplete,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    estimated_cost: idea.l3_estimated_cost || 0,
    expected_savings: idea.l3_expected_savings || 0,
    implementation_timeline: idea.l3_implementation_timeline || "",
    capex: idea.l3_capex || 0,
    opex: idea.l3_opex || 0,
    headcount_impact: idea.l3_headcount_impact || 0,
    business_case_document: idea.l3_business_case_document || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate ROI and Payback Period
  const roi = formData.estimated_cost > 0
    ? ((formData.expected_savings - formData.estimated_cost) / formData.estimated_cost) * 100
    : 0;

  const paybackPeriodMonths = formData.expected_savings > 0
    ? Math.round((formData.estimated_cost / formData.expected_savings) * 12)
    : 0;

  const netSavings = formData.expected_savings - formData.estimated_cost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("ideas")
        .update({
          l3_estimated_cost: formData.estimated_cost,
          l3_expected_savings: formData.expected_savings,
          l3_roi_percentage: roi,
          l3_payback_period_months: paybackPeriodMonths,
          l3_implementation_timeline: formData.implementation_timeline,
          l3_capex: formData.capex,
          l3_opex: formData.opex,
          l3_headcount_impact: formData.headcount_impact,
          l3_business_case_document: formData.business_case_document,
          l3_completed_at: new Date().toISOString(),
          l3_completed_by: idea.created_by, // TODO: Replace with actual user ID
          stage_status: roi >= 0 ? "approved" : "in-review",
        })
        .eq("id", idea.id);

      if (error) throw error;

      toast.success("L3 business case completed successfully!");
      onComplete();
    } catch (error) {
      console.error("Error submitting L3 business case:", error);
      toast.error("Failed to submit business case");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>L3: Business Case Development</CardTitle>
          <CardDescription>
            Complete cost-benefit analysis and ROI calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Financial Analysis Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estimated Cost */}
              <div className="space-y-2">
                <Label htmlFor="estimated-cost">
                  Total Estimated Cost (INR) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="estimated-cost"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.estimated_cost}
                  onChange={(e) =>
                    setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) || 0 })
                  }
                  required
                />
              </div>

              {/* Expected Savings */}
              <div className="space-y-2">
                <Label htmlFor="expected-savings">
                  Expected Annual Savings (INR) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="expected-savings"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.expected_savings}
                  onChange={(e) =>
                    setFormData({ ...formData, expected_savings: parseFloat(e.target.value) || 0 })
                  }
                  required
                />
              </div>

              {/* CAPEX */}
              <div className="space-y-2">
                <Label htmlFor="capex">CAPEX (Capital Expenditure)</Label>
                <Input
                  id="capex"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.capex}
                  onChange={(e) =>
                    setFormData({ ...formData, capex: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              {/* OPEX */}
              <div className="space-y-2">
                <Label htmlFor="opex">OPEX (Operational Expenditure)</Label>
                <Input
                  id="opex"
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.opex}
                  onChange={(e) =>
                    setFormData({ ...formData, opex: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </div>

          {/* Calculated Metrics */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* ROI */}
                <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                  <TrendingUp className={`h-6 w-6 mx-auto mb-2 ${roi >= 0 ? 'text-success' : 'text-destructive'}`} />
                  <p className="text-sm text-muted-foreground">Return on Investment</p>
                  <p className={`text-2xl font-bold ${roi >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {roi.toFixed(1)}%
                  </p>
                </div>

                {/* Payback Period */}
                <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-info" />
                  <p className="text-sm text-muted-foreground">Payback Period</p>
                  <p className="text-2xl font-bold text-info">
                    {paybackPeriodMonths} months
                  </p>
                </div>

                {/* Net Savings */}
                <div className="text-center p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                  <DollarSign className={`h-6 w-6 mx-auto mb-2 ${netSavings >= 0 ? 'text-success' : 'text-destructive'}`} />
                  <p className="text-sm text-muted-foreground">Net Savings (Year 1)</p>
                  <p className={`text-2xl font-bold ${netSavings >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(netSavings)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resource & Timeline Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Resource & Timeline Planning
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Implementation Timeline */}
              <div className="space-y-2">
                <Label htmlFor="implementation-timeline">
                  Implementation Timeline <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="implementation-timeline"
                  type="text"
                  placeholder="e.g., 6 months, Q2 2025"
                  value={formData.implementation_timeline}
                  onChange={(e) =>
                    setFormData({ ...formData, implementation_timeline: e.target.value })
                  }
                  required
                />
              </div>

              {/* Headcount Impact */}
              <div className="space-y-2">
                <Label htmlFor="headcount-impact" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Headcount Impact (FTE)
                </Label>
                <Input
                  id="headcount-impact"
                  type="number"
                  step="0.5"
                  placeholder="Enter positive for additions, negative for reductions"
                  value={formData.headcount_impact}
                  onChange={(e) =>
                    setFormData({ ...formData, headcount_impact: parseFloat(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {formData.headcount_impact > 0 && `+${formData.headcount_impact} FTE additions`}
                  {formData.headcount_impact < 0 && `${formData.headcount_impact} FTE reductions`}
                  {formData.headcount_impact === 0 && "No headcount impact"}
                </p>
              </div>
            </div>
          </div>

          {/* Business Case Document */}
          <div className="space-y-2">
            <Label htmlFor="business-case">
              Detailed Business Case
            </Label>
            <Textarea
              id="business-case"
              value={formData.business_case_document}
              onChange={(e) =>
                setFormData({ ...formData, business_case_document: e.target.value })
              }
              rows={6}
              placeholder="Provide detailed justification, assumptions, risk factors, and implementation approach..."
            />
            <p className="text-xs text-muted-foreground">
              Include: Strategic alignment, market analysis, competitive advantage, risk assessment, implementation approach
            </p>
          </div>

          {/* Recommendation Card */}
          <Card className={roi >= 20 ? "border-success" : roi >= 0 ? "border-warning" : "border-destructive"}>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-2">Business Case Assessment</h4>
              <div className="space-y-2 text-sm">
                {roi >= 20 && (
                  <p className="text-success">
                    ✓ <strong>Strong Business Case:</strong> High ROI with reasonable payback period. Recommended for L4 approval.
                  </p>
                )}
                {roi >= 0 && roi < 20 && (
                  <p className="text-warning">
                    ⚠ <strong>Moderate Business Case:</strong> Positive ROI but may require careful consideration of alternatives.
                  </p>
                )}
                {roi < 0 && (
                  <p className="text-destructive">
                    ✗ <strong>Weak Business Case:</strong> Negative ROI. Consider strategic value or revise approach.
                  </p>
                )}
                {paybackPeriodMonths > 24 && (
                  <p className="text-warning">
                    ⚠ Long payback period ({paybackPeriodMonths} months). Ensure alignment with strategic goals.
                  </p>
                )}
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
        <Button type="submit" variant="blue" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Complete L3 Business Case"}
        </Button>
      </div>
    </form>
  );
};

export default L3BusinessCaseForm;
