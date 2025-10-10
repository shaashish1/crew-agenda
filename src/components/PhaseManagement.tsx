import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { PHASE_NAMES } from "@/data/documentTemplates";
import { supabase } from "@/integrations/supabase/client";

interface Phase {
  id: string;
  phase_name: string;
  phase_number: number;
  status: 'not-started' | 'in-progress' | 'completed';
  start_date?: string;
  end_date?: string;
  gate_approved: boolean;
}

interface PhaseManagementProps {
  projectId: string;
  currentPhaseName: string;
}

export const PhaseManagement: React.FC<PhaseManagementProps> = ({ projectId, currentPhaseName }) => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [phaseProgress, setPhaseProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    loadPhases();
    loadPhaseProgress();
  }, [projectId]);

  const loadPhases = async () => {
    const { data, error } = await supabase
      .from("project_phases")
      .select("*")
      .eq("project_id", projectId)
      .order("phase_number");

    if (!error && data) {
      setPhases(data as Phase[]);
    }
  };

  const loadPhaseProgress = async () => {
    // Calculate completion percentage for each phase
    const progressMap: Record<string, number> = {};
    
    for (const phaseName of PHASE_NAMES) {
      const { data: templates } = await supabase
        .from("document_templates")
        .select("id")
        .eq("phase_name", phaseName);

      const { data: checklist } = await supabase
        .from("project_document_checklist")
        .select("completion_status")
        .eq("project_id", projectId)
        .in("document_template_id", templates?.map(t => t.id) || []);

      const total = checklist?.length || 0;
      const completed = checklist?.filter(c => c.completion_status === 'completed').length || 0;
      progressMap[phaseName] = total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    setPhaseProgress(progressMap);
  };

  const getStatusIcon = (phaseName: string, status?: string) => {
    if (phaseName === currentPhaseName && status !== 'completed') {
      return <PlayCircle className="w-5 h-5 text-primary" />;
    }
    
    if (status === 'completed') {
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    }
    
    return <Circle className="w-5 h-5 text-muted-foreground" />;
  };

  const getStatusBadge = (phaseName: string, status?: string) => {
    if (status === 'completed') {
      return <Badge className="bg-success text-success-foreground">Completed</Badge>;
    }
    
    if (phaseName === currentPhaseName) {
      return <Badge className="bg-primary text-primary-foreground">In Progress</Badge>;
    }
    
    return <Badge variant="outline" className="text-muted-foreground">Not Started</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Phases Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {PHASE_NAMES.map((phaseName, index) => {
          const phase = phases.find(p => p.phase_name === phaseName);
          const progress = phaseProgress[phaseName] || 0;
          const isActive = phaseName === currentPhaseName;

          return (
            <div
              key={phaseName}
              className={`p-4 rounded-lg border transition-all ${
                isActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(phaseName, phase?.status)}
                  <div>
                    <div className="font-medium">{phaseName}</div>
                    {phase?.start_date && (
                      <div className="text-xs text-muted-foreground">
                        Started: {new Date(phase.start_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {phase?.gate_approved && (
                    <Badge variant="outline" className="text-xs">Gate Approved</Badge>
                  )}
                  {getStatusBadge(phaseName, phase?.status)}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Document Completion</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
