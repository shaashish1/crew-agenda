import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Idea } from "@/types/database";

interface L2EvaluationFormProps {
  idea: Idea;
  onComplete: () => void;
  onCancel: () => void;
}

const L2EvaluationForm: React.FC<L2EvaluationFormProps> = ({
  idea,
  onComplete,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    technical_feasibility: idea.l2_technical_feasibility || 3,
    resource_availability: idea.l2_resource_availability || 3,
    timeline_feasibility: idea.l2_timeline_feasibility || 3,
    department_fit: idea.l2_department_fit || 3,
    comments: idea.l2_comments || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const overallScore =
    (formData.technical_feasibility +
      formData.resource_availability +
      formData.timeline_feasibility +
      formData.department_fit) /
    4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("ideas")
        .update({
          l2_technical_feasibility: formData.technical_feasibility,
          l2_resource_availability: formData.resource_availability,
          l2_timeline_feasibility: formData.timeline_feasibility,
          l2_department_fit: formData.department_fit,
          l2_overall_score: overallScore,
          l2_comments: formData.comments,
          l2_completed_at: new Date().toISOString(),
          l2_completed_by: idea.created_by, // TODO: Replace with actual user ID
          stage_status: overallScore >= 3 ? "approved" : "rejected",
        })
        .eq("id", idea.id);

      if (error) throw error;

      toast.success("L2 evaluation completed successfully!");
      onComplete();
    } catch (error) {
      console.error("Error submitting L2 evaluation:", error);
      toast.error("Failed to submit evaluation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-success";
    if (score >= 3) return "text-info";
    if (score >= 2) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Good";
    if (score >= 2.5) return "Fair";
    if (score >= 1.5) return "Poor";
    return "Very Poor";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>L2: Department Review & Scoring</CardTitle>
          <CardDescription>
            Evaluate the idea based on technical feasibility, resource requirements, and departmental fit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Technical Feasibility */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Technical Feasibility</Label>
              <span className="text-sm font-semibold">
                {formData.technical_feasibility.toFixed(1)} / 5.0
              </span>
            </div>
            <Slider
              value={[formData.technical_feasibility]}
              onValueChange={(values) =>
                setFormData({ ...formData, technical_feasibility: values[0] })
              }
              min={0}
              max={5}
              step={0.5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Can this idea be implemented with current technology and expertise?
            </p>
          </div>

          {/* Resource Availability */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Resource Availability</Label>
              <span className="text-sm font-semibold">
                {formData.resource_availability.toFixed(1)} / 5.0
              </span>
            </div>
            <Slider
              value={[formData.resource_availability]}
              onValueChange={(values) =>
                setFormData({ ...formData, resource_availability: values[0] })
              }
              min={0}
              max={5}
              step={0.5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Do we have or can we acquire the necessary resources (people, budget, tools)?
            </p>
          </div>

          {/* Timeline Feasibility */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Timeline Feasibility</Label>
              <span className="text-sm font-semibold">
                {formData.timeline_feasibility.toFixed(1)} / 5.0
              </span>
            </div>
            <Slider
              value={[formData.timeline_feasibility]}
              onValueChange={(values) =>
                setFormData({ ...formData, timeline_feasibility: values[0] })
              }
              min={0}
              max={5}
              step={0.5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Can this be implemented within a reasonable timeframe?
            </p>
          </div>

          {/* Department Fit */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Department/Organizational Fit</Label>
              <span className="text-sm font-semibold">
                {formData.department_fit.toFixed(1)} / 5.0
              </span>
            </div>
            <Slider
              value={[formData.department_fit]}
              onValueChange={(values) =>
                setFormData({ ...formData, department_fit: values[0] })
              }
              min={0}
              max={5}
              step={0.5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              How well does this align with department goals and capabilities?
            </p>
          </div>

          {/* Overall Score Display */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall L2 Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore.toFixed(2)} / 5.0
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rating: {getScoreLabel(overallScore)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Recommendation</p>
                  <p className={`text-lg font-semibold ${overallScore >= 3 ? "text-success" : "text-destructive"}`}>
                    {overallScore >= 3 ? "✓ Proceed to L3" : "✗ Needs Revision"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="l2-comments">
              Reviewer Comments <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="l2-comments"
              value={formData.comments}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              rows={4}
              placeholder="Provide additional context, concerns, or recommendations..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="blue" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Complete L2 Evaluation"}
        </Button>
      </div>
    </form>
  );
};

export default L2EvaluationForm;
