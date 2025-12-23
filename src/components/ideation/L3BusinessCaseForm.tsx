import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedIdea } from "@/types/ideation";
import { DollarSign, TrendingUp, Clock, Users, Calculator } from "lucide-react";

interface L3BusinessCaseFormProps {
  idea: EnhancedIdea;
  onUpdate: () => void;
}

export function L3BusinessCaseForm({ idea, onUpdate }: L3BusinessCaseFormProps) {
  const [estimatedCost, setEstimatedCost] = useState<number>(idea.l4_estimated_cost || 0);
  const [expectedSavings, setExpectedSavings] = useState<number>(idea.l4_estimated_benefits || 0);
  const [capexAmount, setCapexAmount] = useState<number>(0);
  const [opexAmount, setOpexAmount] = useState<number>(0);
  const [headcountImpact, setHeadcountImpact] = useState<number>(0);
  const [implementationTimeline, setImplementationTimeline] = useState<string>(idea.l3_timeline_estimate || "");
  const [technicalFeasibility, setTechnicalFeasibility] = useState<string>(idea.l3_technical_feasibility || "");
  const [resourceRequirements, setResourceRequirements] = useState<string>(idea.l3_resource_requirements || "");
  const [riskAssessment, setRiskAssessment] = useState<string>(idea.l3_risk_assessment || "");
  const [dependencies, setDependencies] = useState<string>(idea.l3_dependencies || "");
  const [assessorName, setAssessorName] = useState<string>(idea.l3_assessed_by || "");
  const [comments, setComments] = useState<string>(idea.l3_comments || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-calculated values
  const calculations = useMemo(() => {
    const netSavings = expectedSavings - estimatedCost;
    const roi = estimatedCost > 0 ? ((expectedSavings - estimatedCost) / estimatedCost) * 100 : 0;
    const paybackPeriod = expectedSavings > 0 ? (estimatedCost / (expectedSavings / 12)) : 0;
    
    return {
      netSavings,
      roi: roi.toFixed(1),
      paybackPeriod: paybackPeriod.toFixed(1),
    };
  }, [estimatedCost, expectedSavings]);

  const getRecommendationBadge = () => {
    const roi = parseFloat(calculations.roi);
    if (roi > 50) {
      return <Badge className="bg-green-500 text-white">Strong Recommendation</Badge>;
    } else if (roi >= 20) {
      return <Badge className="bg-yellow-500 text-white">Moderate Recommendation</Badge>;
    } else {
      return <Badge className="bg-red-500 text-white">Weak Recommendation</Badge>;
    }
  };

  const handleSubmit = async () => {
    if (!assessorName.trim()) {
      toast.error("Please enter assessor name");
      return;
    }

    setIsSubmitting(true);

    try {
      const roi = parseFloat(calculations.roi);
      const payback = parseFloat(calculations.paybackPeriod);
      const shouldAdvance = roi >= 20;

      const updateData: Record<string, any> = {
        l3_technical_feasibility: technicalFeasibility,
        l3_resource_requirements: resourceRequirements,
        l3_timeline_estimate: implementationTimeline,
        l3_risk_assessment: riskAssessment,
        l3_dependencies: dependencies,
        l3_feasibility_score: roi >= 50 ? 5 : roi >= 20 ? 3 : 1,
        l3_assessment_date: new Date().toISOString(),
        l3_assessed_by: assessorName,
        l3_comments: comments,
        l4_estimated_cost: estimatedCost,
        l4_estimated_benefits: expectedSavings,
        l4_roi_percentage: roi,
        l4_payback_period_months: Math.round(payback),
        l4_npv: calculations.netSavings,
        stage_status: shouldAdvance ? 'approved' : 'rejected',
      };

      if (shouldAdvance) {
        updateData.evaluation_stage = 'L3';
        updateData.l2_completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("ideas")
        .update(updateData)
        .eq("id", idea.id);

      if (error) throw error;

      // Record stage history
      await supabase.from("idea_stage_history").insert({
        idea_id: idea.id,
        from_stage: 'L2',
        to_stage: shouldAdvance ? 'L3' : 'L2',
        from_status: 'approved',
        to_status: shouldAdvance ? 'approved' : 'rejected',
        changed_by: assessorName,
        change_reason: shouldAdvance 
          ? `L3 business case approved with ROI ${roi.toFixed(1)}%` 
          : `L3 business case rejected (ROI: ${roi.toFixed(1)}%)`,
      });

      toast.success(
        shouldAdvance 
          ? `Business case approved with ROI ${roi.toFixed(1)}%` 
          : `Business case does not meet ROI threshold`
      );
      
      onUpdate();
    } catch (error) {
      console.error("Error submitting L3 assessment:", error);
      toast.error("Failed to submit assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAlreadyAssessed = idea.l3_assessment_date !== null;
  const canAccess = idea.evaluation_stage !== 'L1' && idea.stage_status === 'approved';

  if (!canAccess) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Complete L2 screening with approval first to access business case development.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">L3 Business Case Development</h3>
        {getRecommendationBadge()}
      </div>

      {isAlreadyAssessed && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              This idea was assessed on {new Date(idea.l3_assessment_date!).toLocaleDateString()} 
              by {idea.l3_assessed_by}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Financial Inputs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financial Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
              <Input
                id="estimatedCost"
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(parseFloat(e.target.value) || 0)}
                placeholder="Enter total cost"
                disabled={isAlreadyAssessed}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedSavings">Expected Savings ($)</Label>
              <Input
                id="expectedSavings"
                type="number"
                value={expectedSavings}
                onChange={(e) => setExpectedSavings(parseFloat(e.target.value) || 0)}
                placeholder="Enter expected annual savings"
                disabled={isAlreadyAssessed}
              />
            </div>
          </div>

          {/* Auto-calculated Results */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">ROI %</p>
              <p className={`text-2xl font-bold ${parseFloat(calculations.roi) >= 20 ? 'text-green-600' : 'text-red-600'}`}>
                {calculations.roi}%
              </p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Payback Period</p>
              <p className="text-2xl font-bold text-foreground">
                {calculations.paybackPeriod} mo
              </p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Net Savings</p>
              <p className={`text-2xl font-bold ${calculations.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${calculations.netSavings.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CAPEX vs OPEX Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            CAPEX vs OPEX Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capex">CAPEX Amount ($)</Label>
              <Input
                id="capex"
                type="number"
                value={capexAmount}
                onChange={(e) => setCapexAmount(parseFloat(e.target.value) || 0)}
                placeholder="Capital expenditure"
                disabled={isAlreadyAssessed}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="opex">OPEX Amount ($)</Label>
              <Input
                id="opex"
                type="number"
                value={opexAmount}
                onChange={(e) => setOpexAmount(parseFloat(e.target.value) || 0)}
                placeholder="Operating expenditure"
                disabled={isAlreadyAssessed}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Headcount Impact */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Headcount Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="headcount">FTE Change (+/-)</Label>
            <Input
              id="headcount"
              type="number"
              value={headcountImpact}
              onChange={(e) => setHeadcountImpact(parseFloat(e.target.value) || 0)}
              placeholder="e.g., -2 for reduction, +3 for addition"
              disabled={isAlreadyAssessed}
            />
            <p className="text-sm text-muted-foreground">
              Positive for additions, negative for reductions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Implementation Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={implementationTimeline} 
            onValueChange={setImplementationTimeline}
            disabled={isAlreadyAssessed}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3mo">3 Months</SelectItem>
              <SelectItem value="6mo">6 Months</SelectItem>
              <SelectItem value="12mo">12 Months</SelectItem>
              <SelectItem value="18mo">18 Months</SelectItem>
              <SelectItem value="24mo+">24+ Months</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Technical Assessment */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Technical Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Technical Feasibility</Label>
            <Textarea
              value={technicalFeasibility}
              onChange={(e) => setTechnicalFeasibility(e.target.value)}
              placeholder="Describe technical requirements and feasibility..."
              disabled={isAlreadyAssessed}
            />
          </div>
          <div className="space-y-2">
            <Label>Resource Requirements</Label>
            <Textarea
              value={resourceRequirements}
              onChange={(e) => setResourceRequirements(e.target.value)}
              placeholder="List required resources (people, tools, systems)..."
              disabled={isAlreadyAssessed}
            />
          </div>
          <div className="space-y-2">
            <Label>Risk Assessment</Label>
            <Textarea
              value={riskAssessment}
              onChange={(e) => setRiskAssessment(e.target.value)}
              placeholder="Identify key risks and mitigation strategies..."
              disabled={isAlreadyAssessed}
            />
          </div>
          <div className="space-y-2">
            <Label>Dependencies</Label>
            <Textarea
              value={dependencies}
              onChange={(e) => setDependencies(e.target.value)}
              placeholder="List dependencies on other projects or systems..."
              disabled={isAlreadyAssessed}
            />
          </div>
        </CardContent>
      </Card>

      {/* Assessor Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="assessorName">Assessor Name *</Label>
          <Input
            id="assessorName"
            value={assessorName}
            onChange={(e) => setAssessorName(e.target.value)}
            placeholder="Enter your name"
            disabled={isAlreadyAssessed}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="comments">Additional Comments</Label>
          <Textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any additional comments or notes..."
            disabled={isAlreadyAssessed}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          <p>ROI threshold for advancement: <strong>≥ 20%</strong></p>
          <p className={parseFloat(calculations.roi) >= 20 ? "text-green-600" : "text-red-600"}>
            {parseFloat(calculations.roi) >= 20 
              ? "✓ Meets threshold - Will advance to L4" 
              : "✗ Below threshold - Review recommended"}
          </p>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || isAlreadyAssessed}
          size="lg"
        >
          {isSubmitting ? "Submitting..." : "Submit L3 Assessment"}
        </Button>
      </div>
    </div>
  );
}
