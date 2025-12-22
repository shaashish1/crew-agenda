import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedIdea } from "@/types/ideation";

interface L2EvaluationFormProps {
  idea: EnhancedIdea;
  onUpdate: () => void;
}

const criteria = [
  {
    key: 'novelty',
    label: 'Novelty',
    description: 'How innovative and unique is this idea?',
  },
  {
    key: 'feasibility',
    label: 'Feasibility',
    description: 'How technically and operationally feasible is this idea?',
  },
  {
    key: 'alignment',
    label: 'Strategic Alignment',
    description: 'How well does this align with organizational goals?',
  },
  {
    key: 'impact',
    label: 'Potential Impact',
    description: 'What is the expected business impact?',
  },
];

export function L2EvaluationForm({ idea, onUpdate }: L2EvaluationFormProps) {
  const [scores, setScores] = useState({
    novelty: idea.l2_novelty_score || 3,
    feasibility: idea.l2_feasibility_score || 3,
    alignment: idea.l2_alignment_score || 3,
    impact: idea.l2_impact_score || 3,
  });
  const [comments, setComments] = useState(idea.l2_comments || "");
  const [reviewerName, setReviewerName] = useState(idea.l2_screened_by || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const overallScore = (
    (scores.novelty + scores.feasibility + scores.alignment + scores.impact) / 4
  ).toFixed(2);

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const handleSubmit = async () => {
    if (!reviewerName.trim()) {
      toast.error("Please enter reviewer name");
      return;
    }

    setIsSubmitting(true);

    try {
      const calculatedOverall = parseFloat(overallScore);
      const shouldAdvance = calculatedOverall >= 3.0;

      // Update idea with L2 scores
      const updateData: Record<string, any> = {
        l2_novelty_score: scores.novelty,
        l2_feasibility_score: scores.feasibility,
        l2_alignment_score: scores.alignment,
        l2_impact_score: scores.impact,
        l2_overall_score: calculatedOverall,
        l2_screening_date: new Date().toISOString(),
        l2_screened_by: reviewerName,
        l2_comments: comments,
        stage_status: shouldAdvance ? 'approved' : 'rejected',
      };

      if (shouldAdvance) {
        updateData.evaluation_stage = 'L2';
        updateData.l1_completed_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from("ideas")
        .update(updateData)
        .eq("id", idea.id);

      if (updateError) throw updateError;

      // Create review record
      const { error: reviewError } = await supabase
        .from("idea_reviews")
        .insert({
          idea_id: idea.id,
          reviewer_name: reviewerName,
          stage: 'L2',
          novelty_score: scores.novelty,
          feasibility_score: scores.feasibility,
          alignment_score: scores.alignment,
          impact_score: scores.impact,
          overall_score: calculatedOverall,
          recommendation: shouldAdvance ? 'approve' : 'reject',
          comments,
        });

      if (reviewError) throw reviewError;

      // Record stage history
      await supabase.from("idea_stage_history").insert({
        idea_id: idea.id,
        from_stage: 'L1',
        to_stage: shouldAdvance ? 'L2' : 'L1',
        from_status: 'pending',
        to_status: shouldAdvance ? 'approved' : 'rejected',
        changed_by: reviewerName,
        change_reason: shouldAdvance 
          ? `L2 screening passed with score ${calculatedOverall}` 
          : `L2 screening failed with score ${calculatedOverall}`,
      });

      toast.success(
        shouldAdvance 
          ? `Idea approved for L2 with score ${calculatedOverall}` 
          : `Idea rejected at L2 screening (score: ${calculatedOverall})`
      );
      
      onUpdate();
    } catch (error) {
      console.error("Error submitting L2 evaluation:", error);
      toast.error("Failed to submit evaluation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAlreadyEvaluated = idea.l2_screening_date !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">L2 Screening Evaluation</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Overall Score:</span>
          <Badge 
            variant={parseFloat(overallScore) >= 3 ? "success" : "destructive"}
            className="text-lg px-3 py-1"
          >
            {overallScore} / 5.0
          </Badge>
        </div>
      </div>

      {isAlreadyEvaluated && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">
              This idea was evaluated on {new Date(idea.l2_screening_date!).toLocaleDateString()} 
              by {idea.l2_screened_by}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {criteria.map((criterion) => (
          <Card key={criterion.key}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{criterion.label}</CardTitle>
                <span className={`text-2xl font-bold ${getScoreColor(scores[criterion.key as keyof typeof scores])}`}>
                  {scores[criterion.key as keyof typeof scores].toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{criterion.description}</p>
            </CardHeader>
            <CardContent>
              <Slider
                value={[scores[criterion.key as keyof typeof scores]]}
                onValueChange={([value]) =>
                  setScores((prev) => ({ ...prev, [criterion.key]: value }))
                }
                min={0}
                max={5}
                step={0.5}
                disabled={isAlreadyEvaluated}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0 - Poor</span>
                <span>2.5 - Average</span>
                <span>5 - Excellent</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reviewerName">Reviewer Name *</Label>
          <input
            id="reviewerName"
            type="text"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Enter your name"
            disabled={isAlreadyEvaluated}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="comments">Evaluation Comments</Label>
          <Textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            placeholder="Add your evaluation comments, feedback, or recommendations..."
            disabled={isAlreadyEvaluated}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          <p>Threshold for advancement: <strong>≥ 3.0</strong></p>
          <p className={parseFloat(overallScore) >= 3 ? "text-green-600" : "text-red-600"}>
            {parseFloat(overallScore) >= 3 
              ? "✓ Meets threshold - Will advance to L2" 
              : "✗ Below threshold - Will be rejected"}
          </p>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || isAlreadyEvaluated}
          size="lg"
        >
          {isSubmitting ? "Submitting..." : "Submit L2 Evaluation"}
        </Button>
      </div>
    </div>
  );
}
