import { cn } from "@/lib/utils";
import { Check, Clock, XCircle, Pause, ChevronRight } from "lucide-react";
import { EvaluationStage, StageStatus } from "@/types/ideation";

interface StageProgressIndicatorProps {
  currentStage: EvaluationStage;
  stageStatus: StageStatus;
  completedStages?: {
    l1?: string | null;
    l2?: string | null;
    l3?: string | null;
    l4?: string | null;
    l5?: string | null;
  };
}

const stages: { key: EvaluationStage; label: string; description: string }[] = [
  { key: 'L1', label: 'L1', description: 'Submission' },
  { key: 'L2', label: 'L2', description: 'Screening' },
  { key: 'L3', label: 'L3', description: 'Feasibility' },
  { key: 'L4', label: 'L4', description: 'Business Case' },
  { key: 'L5', label: 'L5', description: 'Implementation' },
];

const stageOrder: Record<EvaluationStage, number> = {
  'L1': 0,
  'L2': 1,
  'L3': 2,
  'L4': 3,
  'L5': 4,
};

export function StageProgressIndicator({
  currentStage,
  stageStatus,
  completedStages = {},
}: StageProgressIndicatorProps) {
  const currentIndex = stageOrder[currentStage];

  const getStageState = (stage: EvaluationStage, index: number) => {
    const completedKey = `l${index + 1}` as keyof typeof completedStages;
    
    if (completedStages[completedKey]) {
      return 'completed';
    }
    
    if (index < currentIndex) {
      return 'completed';
    }
    
    if (index === currentIndex) {
      if (stageStatus === 'approved') return 'completed';
      if (stageStatus === 'rejected') return 'rejected';
      if (stageStatus === 'on_hold') return 'on_hold';
      if (stageStatus === 'in_progress') return 'in_progress';
      return 'current';
    }
    
    return 'upcoming';
  };

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'completed':
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'on_hold':
        return <Pause className="h-4 w-4" />;
      case 'in_progress':
      case 'current':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'completed':
        return 'bg-green-500 text-white border-green-500';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground border-destructive';
      case 'on_hold':
        return 'bg-yellow-500 text-white border-yellow-500';
      case 'in_progress':
        return 'bg-blue-500 text-white border-blue-500 animate-pulse';
      case 'current':
        return 'bg-primary text-primary-foreground border-primary';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConnectorColor = (state: string) => {
    switch (state) {
      case 'completed':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-destructive';
      default:
        return 'bg-border';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const state = getStageState(stage.key, index);
          const isLast = index === stages.length - 1;

          return (
            <div key={stage.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-all",
                    getStatusColor(state)
                  )}
                >
                  {getStatusIcon(state) || stage.label}
                </div>
                <span className="mt-2 text-xs font-medium text-foreground">
                  {stage.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stage.description}
                </span>
              </div>
              
              {!isLast && (
                <div className="flex-1 mx-2">
                  <div
                    className={cn(
                      "h-1 rounded-full transition-all",
                      index < currentIndex ? getConnectorColor('completed') : getConnectorColor('upcoming')
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
