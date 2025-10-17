import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Milestone } from "@/types/project";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MilestoneDialog } from "./MilestoneDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface MilestoneTimelineProps {
  projectId: string;
}

export const MilestoneTimeline = ({ projectId }: MilestoneTimelineProps) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadMilestones();
  }, [projectId]);

  const loadMilestones = async () => {
    const { data, error } = await supabase
      .from("milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error loading milestones:", error);
      return;
    }

    if (data) {
      const formattedMilestones: Milestone[] = data.map((m) => ({
        id: m.id,
        projectId: m.project_id,
        name: m.name,
        description: m.description || undefined,
        targetDate: m.target_date,
        baselineTargetDate: m.baseline_target_date || undefined,
        completedDate: m.completed_date || undefined,
        status: m.status as Milestone['status'],
        order: m.order_index,
        dependencies: m.dependencies || [],
        isCriticalPath: m.is_critical_path || false,
        approvalRequired: m.approval_required || false,
        approvedBy: m.approved_by || undefined,
        approvedDate: m.approved_date || undefined,
      }));
      setMilestones(formattedMilestones);
    }
  };

  const handleAddMilestone = () => {
    setSelectedMilestone(null);
    setDialogOpen(true);
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setDialogOpen(true);
  };

  const handleDeleteClick = (milestoneId: string) => {
    setMilestoneToDelete(milestoneId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!milestoneToDelete) return;

    const { error } = await supabase
      .from("milestones")
      .delete()
      .eq("id", milestoneToDelete);

    if (error) {
      toast.error("Failed to delete milestone");
      return;
    }

    toast.success("Milestone deleted successfully");
    loadMilestones();
    setDeleteDialogOpen(false);
    setMilestoneToDelete(null);
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'in-progress':
        return 'bg-info';
      case 'delayed':
        return 'bg-destructive';
      case 'at-risk':
        return 'bg-warning';
      default:
        return 'bg-muted';
    }
  };

  const getStatusForeground = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success-foreground';
      case 'in-progress':
        return 'text-info-foreground';
      case 'delayed':
        return 'text-destructive-foreground';
      case 'at-risk':
        return 'text-warning-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const hasBaselineVariance = (milestone: Milestone) => {
    return milestone.baselineTargetDate && 
           milestone.targetDate !== milestone.baselineTargetDate;
  };

  const getDependencyNames = (milestone: Milestone) => {
    if (!milestone.dependencies || milestone.dependencies.length === 0) return null;
    return milestone.dependencies
      .map(depId => milestones.find(m => m.id === depId)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <>
      <Card>
        <CardHeader className="bg-primary text-primary-foreground">
          <div className="flex justify-between items-center">
            <CardTitle>Milestones</CardTitle>
            <Button size="sm" variant="secondary" className="gap-2" onClick={handleAddMilestone}>
              <Plus className="w-4 h-4" />
              Add Milestone
            </Button>
          </div>
        </CardHeader>
      <CardContent className="pt-6">
        {milestones.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No milestones defined yet
          </p>
        ) : (
          <div className="space-y-8">
            {/* Timeline visualization */}
            <div className="relative">
              <div className="flex justify-between items-center overflow-x-auto pb-16">
                {milestones.map((milestone, idx) => (
                  <div key={milestone.id} className="flex flex-col items-center min-w-[120px]">
                    {/* Arrow connector */}
                    {idx < milestones.length - 1 && (
                      <div className="absolute top-12 left-0 w-full h-8 flex items-center">
                        <div 
                          className="h-0 border-t-2 border-muted"
                          style={{
                            width: `calc(${100 / milestones.length}% - 40px)`,
                            marginLeft: `calc(${(idx * 100) / milestones.length}% + 60px)`
                          }}
                        >
                          <div className="float-right -mt-1.5">
                            <div className="w-0 h-0 border-l-8 border-l-muted border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Milestone marker */}
                    <div className={`w-12 h-12 rounded-full ${getStatusColor(milestone.status)} flex items-center justify-center mb-2 relative z-10`}>
                      <div className="w-6 h-6 bg-background rounded-full"></div>
                    </div>
                    
                    {/* Milestone info */}
                    <p className="text-xs font-medium text-center mb-1 px-2">
                      {milestone.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(milestone.targetDate), 'dd MMM yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone details table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Milestone</th>
                    <th className="text-left p-3 text-sm font-medium">Target Date</th>
                    <th className="text-left p-3 text-sm font-medium">Status</th>
                    <th className="text-left p-3 text-sm font-medium">Flags</th>
                    <th className="text-left p-3 text-sm font-medium">Dependencies</th>
                    <th className="text-left p-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.map((milestone) => (
                    <tr key={milestone.id} className="border-t hover:bg-muted/30">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{milestone.name}</p>
                          {milestone.description && (
                            <p className="text-xs text-muted-foreground">{milestone.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        <div>
                          <p>{format(new Date(milestone.targetDate), 'dd MMM yyyy')}</p>
                          {hasBaselineVariance(milestone) && (
                            <div className="flex items-center gap-1 text-xs text-warning mt-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Baseline: {format(new Date(milestone.baselineTargetDate!), 'dd MMM')}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(milestone.status)} ${getStatusForeground(milestone.status)}`}>
                          {milestone.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {milestone.isCriticalPath && (
                            <Badge variant="destructive" className="text-xs">Critical Path</Badge>
                          )}
                          {milestone.approvalRequired && (
                            <Badge variant="outline" className="text-xs">
                              {milestone.approvedBy ? `✓ ${milestone.approvedBy}` : 'Approval Req.'}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {getDependencyNames(milestone) || '-'}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditMilestone(milestone)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteClick(milestone.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

    <MilestoneDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      milestone={selectedMilestone}
      projectId={projectId}
      allMilestones={milestones}
      onSave={loadMilestones}
    />

    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Milestone</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this milestone? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};
