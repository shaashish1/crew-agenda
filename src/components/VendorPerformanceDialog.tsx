import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface VendorPerformanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  projectId: string;
  vendors: any[];
}

export const VendorPerformanceDialog = ({ open, onOpenChange, onSuccess, projectId, vendors }: VendorPerformanceDialogProps) => {
  const [formData, setFormData] = useState<{
    vendor_id: string;
    review_period_start: string;
    review_period_end: string;
    overall_rating: "excellent" | "good" | "satisfactory" | "needs_improvement" | "poor";
    quality_rating: "excellent" | "good" | "satisfactory" | "needs_improvement" | "poor";
    timeliness_rating: "excellent" | "good" | "satisfactory" | "needs_improvement" | "poor";
    communication_rating: "excellent" | "good" | "satisfactory" | "needs_improvement" | "poor";
    cost_effectiveness_rating: "excellent" | "good" | "satisfactory" | "needs_improvement" | "poor";
    strengths: string;
    areas_for_improvement: string;
    recommendations: string;
    reviewed_by: string;
  }>({
    vendor_id: "",
    review_period_start: "",
    review_period_end: "",
    overall_rating: "satisfactory",
    quality_rating: "satisfactory",
    timeliness_rating: "satisfactory",
    communication_rating: "satisfactory",
    cost_effectiveness_rating: "satisfactory",
    strengths: "",
    areas_for_improvement: "",
    recommendations: "",
    reviewed_by: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vendor_id || !formData.review_period_start || !formData.review_period_end || !formData.reviewed_by) {
      toast({
        title: "Validation Error",
        description: "Vendor, review period, and reviewer are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase.from('vendor_performance_reviews').insert([{
        ...formData,
        project_id: projectId,
      }]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Performance review added successfully",
      });
      
      setFormData({
        vendor_id: "",
        review_period_start: "",
        review_period_end: "",
        overall_rating: "satisfactory",
        quality_rating: "satisfactory",
        timeliness_rating: "satisfactory",
        communication_rating: "satisfactory",
        cost_effectiveness_rating: "satisfactory",
        strengths: "",
        areas_for_improvement: "",
        recommendations: "",
        reviewed_by: "",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Vendor Performance Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="vendor_id">Vendor *</Label>
              <Select value={formData.vendor_id} onValueChange={(value) => setFormData({ ...formData, vendor_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="review_period_start">Review Period Start *</Label>
                <Input
                  id="review_period_start"
                  type="date"
                  value={formData.review_period_start}
                  onChange={(e) => setFormData({ ...formData, review_period_start: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="review_period_end">Review Period End *</Label>
                <Input
                  id="review_period_end"
                  type="date"
                  value={formData.review_period_end}
                  onChange={(e) => setFormData({ ...formData, review_period_end: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="overall_rating">Overall Rating *</Label>
              <Select value={formData.overall_rating} onValueChange={(value) => setFormData({ ...formData, overall_rating: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="satisfactory">Satisfactory</SelectItem>
                  <SelectItem value="needs_improvement">Needs Improvement</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quality_rating">Quality Rating</Label>
                <Select value={formData.quality_rating} onValueChange={(value) => setFormData({ ...formData, quality_rating: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="satisfactory">Satisfactory</SelectItem>
                    <SelectItem value="needs_improvement">Needs Improvement</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeliness_rating">Timeliness Rating</Label>
                <Select value={formData.timeliness_rating} onValueChange={(value) => setFormData({ ...formData, timeliness_rating: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="satisfactory">Satisfactory</SelectItem>
                    <SelectItem value="needs_improvement">Needs Improvement</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="communication_rating">Communication Rating</Label>
                <Select value={formData.communication_rating} onValueChange={(value) => setFormData({ ...formData, communication_rating: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="satisfactory">Satisfactory</SelectItem>
                    <SelectItem value="needs_improvement">Needs Improvement</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cost_effectiveness_rating">Cost Effectiveness Rating</Label>
                <Select value={formData.cost_effectiveness_rating} onValueChange={(value) => setFormData({ ...formData, cost_effectiveness_rating: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="satisfactory">Satisfactory</SelectItem>
                    <SelectItem value="needs_improvement">Needs Improvement</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="strengths">Strengths</Label>
              <Textarea
                id="strengths"
                value={formData.strengths}
                onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                placeholder="What are the vendor's key strengths?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="areas_for_improvement">Areas for Improvement</Label>
              <Textarea
                id="areas_for_improvement"
                value={formData.areas_for_improvement}
                onChange={(e) => setFormData({ ...formData, areas_for_improvement: e.target.value })}
                placeholder="What areas need improvement?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea
                id="recommendations"
                value={formData.recommendations}
                onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                placeholder="Recommendations for future engagements"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="reviewed_by">Reviewed By *</Label>
              <Input
                id="reviewed_by"
                value={formData.reviewed_by}
                onChange={(e) => setFormData({ ...formData, reviewed_by: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};