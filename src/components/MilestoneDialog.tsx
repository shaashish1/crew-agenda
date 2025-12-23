import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Milestone } from "@/types/project";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface MilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone: Milestone | null;
  projectId: string;
  allMilestones: Milestone[];
  onSave: () => void;
}

export const MilestoneDialog = ({
  open,
  onOpenChange,
  milestone,
  projectId,
  allMilestones,
  onSave,
}: MilestoneDialogProps) => {
  const [formData, setFormData] = useState<Partial<Milestone>>({
    name: "",
    description: "",
    targetDate: "",
    baselineTargetDate: "",
    completedDate: "",
    status: "planned",
    dependencies: [],
    isCriticalPath: false,
    approvalRequired: false,
    approvedBy: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (milestone) {
      setFormData({
        name: milestone.name,
        description: milestone.description || "",
        targetDate: milestone.targetDate,
        baselineTargetDate: milestone.baselineTargetDate || milestone.targetDate,
        completedDate: milestone.completedDate || "",
        status: milestone.status,
        dependencies: milestone.dependencies || [],
        isCriticalPath: milestone.isCriticalPath || false,
        approvalRequired: milestone.approvalRequired || false,
        approvedBy: milestone.approvedBy || "",
        approvedDate: milestone.approvedDate || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        targetDate: "",
        baselineTargetDate: "",
        completedDate: "",
        status: "planned",
        dependencies: [],
        isCriticalPath: false,
        approvalRequired: false,
        approvedBy: "",
      });
    }
  }, [milestone, open]);

  const handleSave = async () => {
    if (!formData.name || !formData.targetDate) {
      toast.error("Please fill in required fields");
      return;
    }

    setSaving(true);

    try {
      const milestoneData = {
        project_id: projectId,
        name: formData.name,
        description: formData.description || null,
        target_date: formData.targetDate,
        baseline_target_date: formData.baselineTargetDate || formData.targetDate,
        completed_date: formData.completedDate || null,
        status: formData.status,
        order_index: milestone?.order || allMilestones.length,
        dependencies: formData.dependencies || [],
        is_critical_path: formData.isCriticalPath || false,
        approval_required: formData.approvalRequired || false,
        approved_by: formData.approvedBy || null,
        approved_date: formData.approvedDate || null,
      };

      if (milestone) {
        const { error } = await supabase
          .from("milestones")
          .update(milestoneData)
          .eq("id", milestone.id);

        if (error) throw error;
        toast.success("Milestone updated successfully");
      } else {
        const { error } = await supabase
          .from("milestones")
          .insert(milestoneData);

        if (error) throw error;
        toast.success("Milestone created successfully");
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving milestone:", error);
      toast.error("Failed to save milestone");
    } finally {
      setSaving(false);
    }
  };

  const toggleDependency = (milestoneId: string) => {
    const deps = formData.dependencies || [];
    if (deps.includes(milestoneId)) {
      setFormData({ ...formData, dependencies: deps.filter(id => id !== milestoneId) });
    } else {
      setFormData({ ...formData, dependencies: [...deps, milestoneId] });
    }
  };

  const availableDependencies = allMilestones.filter(m => m.id !== milestone?.id);
  const hasBaselineVariance = formData.baselineTargetDate && formData.targetDate && 
    formData.baselineTargetDate !== formData.targetDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{milestone ? "Edit Milestone" : "Add Milestone"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Milestone Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Project Kickoff"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Milestone description..."
              rows={3}
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Baseline Target Date */}
            <div>
              <Label>Baseline Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.baselineTargetDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.baselineTargetDate ? (
                      format(new Date(formData.baselineTargetDate), "PPP")
                    ) : (
                      <span>Pick baseline date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.baselineTargetDate ? new Date(formData.baselineTargetDate) : undefined}
                    onSelect={(date) => setFormData({ ...formData, baselineTargetDate: date?.toISOString() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Current Target Date */}
            <div>
              <Label>Current Target Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.targetDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.targetDate ? (
                      format(new Date(formData.targetDate), "PPP")
                    ) : (
                      <span>Pick target date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.targetDate ? new Date(formData.targetDate) : undefined}
                    onSelect={(date) => setFormData({ ...formData, targetDate: date?.toISOString() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Baseline Variance Warning */}
          {hasBaselineVariance && (
            <div className="bg-warning/10 border border-warning rounded-lg p-3">
              <p className="text-sm text-warning font-medium">
                ⚠️ Timeline Variance Detected
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Current target date differs from baseline. This may impact project timeline.
              </p>
            </div>
          )}

          {/* Completed Date (only if status is completed) */}
          {formData.status === "completed" && (
            <div>
              <Label>Completed Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.completedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.completedDate ? (
                      format(new Date(formData.completedDate), "PPP")
                    ) : (
                      <span>Pick completion date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.completedDate ? new Date(formData.completedDate) : undefined}
                    onSelect={(date) => setFormData({ ...formData, completedDate: date?.toISOString() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Dependencies */}
          {availableDependencies.length > 0 && (
            <div>
              <Label>Dependencies</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select milestones that must be completed before this one
              </p>
              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                {availableDependencies.map((dep) => (
                  <div key={dep.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dep-${dep.id}`}
                      checked={formData.dependencies?.includes(dep.id)}
                      onCheckedChange={() => toggleDependency(dep.id)}
                    />
                    <label
                      htmlFor={`dep-${dep.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {dep.name}
                      <span className="text-xs text-muted-foreground ml-2">
                        ({format(new Date(dep.targetDate), "MMM dd, yyyy")})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flags */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="critical-path"
                checked={formData.isCriticalPath}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, isCriticalPath: checked as boolean })
                }
              />
              <label htmlFor="critical-path" className="text-sm font-medium cursor-pointer">
                Mark as Critical Path
                <span className="text-xs text-muted-foreground ml-2">
                  (Delays will directly impact project completion)
                </span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="approval-required"
                checked={formData.approvalRequired}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, approvalRequired: checked as boolean })
                }
              />
              <label htmlFor="approval-required" className="text-sm font-medium cursor-pointer">
                Requires Approval
                <span className="text-xs text-muted-foreground ml-2">
                  (Milestone completion needs approval)
                </span>
              </label>
            </div>
          </div>

          {/* Approval Section */}
          {formData.approvalRequired && (
            <div className="border rounded-lg p-3 bg-muted/30 space-y-3">
              <Label htmlFor="approved-by">Approved By</Label>
              <Input
                id="approved-by"
                value={formData.approvedBy}
                onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                placeholder="Approver name"
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : milestone ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
