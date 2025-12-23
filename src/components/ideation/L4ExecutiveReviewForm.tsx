import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
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
import { 
  Target, 
  Shield, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  PauseCircle,
  AlertTriangle
} from "lucide-react";

interface L4ExecutiveReviewFormProps {
  idea: EnhancedIdea;
  onUpdate: () => void;
}

export function L4ExecutiveReviewForm({ idea, onUpdate }: L4ExecutiveReviewFormProps) {
  const [strategicAlignmentScore, setStrategicAlignmentScore] = useState<number>(
    idea.l4_strategic_fit_score || 3
  );
  const [portfolioFit, setPortfolioFit] = useState<string>("");
  const [riskLevel, setRiskLevel] = useState<string>("");
  const [finalDecision, setFinalDecision] = useState<string>("");
  const [approvedBudget, setApprovedBudget] = useState<number>(idea.l4_estimated_cost || 0);
  const [conditionalRequirements, setConditionalRequirements] = useState<string>("");
  const [marketPotential, setMarketPotential] = useState<string>(idea.l4_market_potential || "");
  const [competitiveAdvantage, setCompetitiveAdvantage] = useState<string>(idea.l4_competitive_advantage || "");
  const [approverName, setApproverName] = useState<string>(idea.l4_approved_by || "");
  const [comments, setComments] = useState<string>(idea.l4_comments || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRiskBadge = () => {
    const variants: Record<string, { color: string; icon: React.ReactNode }> = {
      low: { color: "bg-green-500", icon: <Shield className="h-3 w-3" /> },
      medium: { color: "bg-yellow-500", icon: <AlertTriangle className="h-3 w-3" /> },
      high: { color: "bg-orange-500", icon: <AlertTriangle className="h-3 w-3" /> },
      critical: { color: "bg-red-500", icon: <AlertTriangle className="h-3 w-3" /> },
    };
    
    if (!riskLevel) return null;
    const { color, icon } = variants[riskLevel] || variants.medium;
    
    return (
      <Badge className={`${color} text-white gap-1`}>
        {icon}
        {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
      </Badge>
    );
  };

  const handleSubmit = async () => {
    if (!approverName.trim()) {
      toast.error("Please enter approver name");
      return;
    }
    if (!finalDecision) {
      toast.error("Please select a decision");
      return;
    }

    setIsSubmitting(true);

    try {
      const isApproved = finalDecision === 'approve';
      const isOnHold = finalDecision === 'on_hold';

      const updateData: Record<string, any> = {
        l4_strategic_fit_score: strategicAlignmentScore,
        l4_market_potential: marketPotential,
        l4_competitive_advantage: competitiveAdvantage,
        l4_approval_date: new Date().toISOString(),
        l4_approved_by: approverName,
        l4_comments: comments,
        stage_status: isApproved ? 'approved' : isOnHold ? 'on_hold' : 'rejected',
      };

      if (isApproved) {
        updateData.evaluation_stage = 'L4';
        updateData.l3_completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("ideas")
        .update(updateData)
        .eq("id", idea.id);

      if (error) throw error;

      // Record stage history
      await supabase.from("idea_stage_history").insert({
        idea_id: idea.id,
        from_stage: 'L3',
        to_stage: isApproved ? 'L4' : 'L3',
        from_status: 'approved',
        to_status: isApproved ? 'approved' : isOnHold ? 'on_hold' : 'rejected',
        changed_by: approverName,
        change_reason: isApproved 
          ? `Executive approval granted with budget $${approvedBudget.toLocaleString()}` 
          : isOnHold
          ? `Placed on hold: ${conditionalRequirements || 'Pending further review'}`
          : `Executive review rejected: ${comments || 'Does not meet strategic criteria'}`,
      });

      toast.success(
        isApproved 
          ? "Executive approval granted - advancing to L5 Implementation" 
          : isOnHold
          ? "Idea placed on hold"
          : "Executive review: Not approved"
      );
      
      onUpdate();
    } catch (error) {
      console.error("Error submitting L4 review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAlreadyReviewed = idea.l4_approval_date !== null;
  const canAccess = ['L3', 'L4', 'L5'].includes(idea.evaluation_stage) && 
    (idea.stage_status === 'approved' || idea.l3_assessment_date !== null);

  if (!canAccess) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Complete L3 business case development first to access executive review.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">L4 Executive Review</h3>
        {getRiskBadge()}
      </div>

      {isAlreadyReviewed && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              This idea was reviewed on {new Date(idea.l4_approval_date!).toLocaleDateString()} 
              by {idea.l4_approved_by}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Business Case Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Business Case Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Est. Cost</p>
              <p className="text-lg font-bold">
                ${idea.l4_estimated_cost?.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Est. Benefits</p>
              <p className="text-lg font-bold">
                ${idea.l4_estimated_benefits?.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ROI</p>
              <p className="text-lg font-bold text-green-600">
                {idea.l4_roi_percentage?.toFixed(1) || '0'}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payback</p>
              <p className="text-lg font-bold">
                {idea.l4_payback_period_months || '0'} mo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Alignment */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Strategic Alignment Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              How well does this align with strategic objectives?
            </span>
            <span className={`text-2xl font-bold ${
              strategicAlignmentScore >= 4 ? 'text-green-600' : 
              strategicAlignmentScore >= 3 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {strategicAlignmentScore.toFixed(1)}
            </span>
          </div>
          <Slider
            value={[strategicAlignmentScore]}
            onValueChange={([value]) => setStrategicAlignmentScore(value)}
            min={0}
            max={5}
            step={0.5}
            disabled={isAlreadyReviewed}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 - No Alignment</span>
            <span>2.5 - Moderate</span>
            <span>5 - Perfect Fit</span>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Fit Assessment */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Portfolio Fit Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={portfolioFit} onValueChange={setPortfolioFit} disabled={isAlreadyReviewed}>
            <SelectTrigger>
              <SelectValue placeholder="Select portfolio fit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent - Core strategic initiative</SelectItem>
              <SelectItem value="good">Good - Complements existing portfolio</SelectItem>
              <SelectItem value="fair">Fair - Tangential to current focus</SelectItem>
              <SelectItem value="poor">Poor - Outside strategic scope</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Risk Level Classification */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Risk Level Classification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={riskLevel} onValueChange={setRiskLevel} disabled={isAlreadyReviewed}>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="cursor-pointer flex-1">
                  <span className="text-green-600 font-medium">Low</span>
                  <p className="text-xs text-muted-foreground">Minimal risk</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="cursor-pointer flex-1">
                  <span className="text-yellow-600 font-medium">Medium</span>
                  <p className="text-xs text-muted-foreground">Manageable</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="cursor-pointer flex-1">
                  <span className="text-orange-600 font-medium">High</span>
                  <p className="text-xs text-muted-foreground">Significant</p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                <RadioGroupItem value="critical" id="critical" />
                <Label htmlFor="critical" className="cursor-pointer flex-1">
                  <span className="text-red-600 font-medium">Critical</span>
                  <p className="text-xs text-muted-foreground">Major concerns</p>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Market & Competitive Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Market & Competitive Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Market Potential</Label>
            <Textarea
              value={marketPotential}
              onChange={(e) => setMarketPotential(e.target.value)}
              placeholder="Describe the market opportunity..."
              disabled={isAlreadyReviewed}
            />
          </div>
          <div className="space-y-2">
            <Label>Competitive Advantage</Label>
            <Textarea
              value={competitiveAdvantage}
              onChange={(e) => setCompetitiveAdvantage(e.target.value)}
              placeholder="What competitive edge does this provide?"
              disabled={isAlreadyReviewed}
            />
          </div>
        </CardContent>
      </Card>

      {/* Final Decision */}
      <Card className="border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Executive Decision
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={finalDecision} onValueChange={setFinalDecision} disabled={isAlreadyReviewed}>
            <div className="grid grid-cols-3 gap-4">
              <div className={`flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                finalDecision === 'approve' ? 'border-green-500 bg-green-50' : 'hover:border-green-300'
              }`}>
                <RadioGroupItem value="approve" id="approve" />
                <Label htmlFor="approve" className="cursor-pointer flex-1 text-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <span className="font-medium block">Approve</span>
                  <p className="text-xs text-muted-foreground">Proceed to implementation</p>
                </Label>
              </div>
              <div className={`flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                finalDecision === 'on_hold' ? 'border-yellow-500 bg-yellow-50' : 'hover:border-yellow-300'
              }`}>
                <RadioGroupItem value="on_hold" id="on_hold" />
                <Label htmlFor="on_hold" className="cursor-pointer flex-1 text-center">
                  <PauseCircle className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                  <span className="font-medium block">On Hold</span>
                  <p className="text-xs text-muted-foreground">Defer decision</p>
                </Label>
              </div>
              <div className={`flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                finalDecision === 'reject' ? 'border-red-500 bg-red-50' : 'hover:border-red-300'
              }`}>
                <RadioGroupItem value="reject" id="reject" />
                <Label htmlFor="reject" className="cursor-pointer flex-1 text-center">
                  <XCircle className="h-6 w-6 text-red-600 mx-auto mb-1" />
                  <span className="font-medium block">Reject</span>
                  <p className="text-xs text-muted-foreground">Do not proceed</p>
                </Label>
              </div>
            </div>
          </RadioGroup>

          {finalDecision === 'approve' && (
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="budget">Approved Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={approvedBudget}
                onChange={(e) => setApprovedBudget(parseFloat(e.target.value) || 0)}
                placeholder="Enter approved budget amount"
                disabled={isAlreadyReviewed}
              />
            </div>
          )}

          {(finalDecision === 'on_hold' || finalDecision === 'approve') && (
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="conditions">Conditional Requirements</Label>
              <Textarea
                id="conditions"
                value={conditionalRequirements}
                onChange={(e) => setConditionalRequirements(e.target.value)}
                placeholder="Any conditions or requirements before proceeding..."
                disabled={isAlreadyReviewed}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approver Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="approverName">Approver Name *</Label>
          <Input
            id="approverName"
            value={approverName}
            onChange={(e) => setApproverName(e.target.value)}
            placeholder="Enter your name"
            disabled={isAlreadyReviewed}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="comments">Review Comments</Label>
          <Textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add any comments or rationale for your decision..."
            disabled={isAlreadyReviewed}
          />
        </div>
      </div>

      <div className="flex items-center justify-end pt-4 border-t">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || isAlreadyReviewed || !finalDecision}
          size="lg"
          className={
            finalDecision === 'approve' ? 'bg-green-600 hover:bg-green-700' :
            finalDecision === 'reject' ? 'bg-red-600 hover:bg-red-700' :
            finalDecision === 'on_hold' ? 'bg-yellow-600 hover:bg-yellow-700' : ''
          }
        >
          {isSubmitting ? "Submitting..." : "Submit Executive Decision"}
        </Button>
      </div>
    </div>
  );
}
