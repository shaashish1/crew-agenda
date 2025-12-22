import { Check, Circle, XCircle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { EvaluationStage, StageStatus } from "@/types/database";

interface StageProgressIndicatorProps {
  currentStage: EvaluationStage;
  stageStatus: StageStatus;
  completedStages?: EvaluationStage[];
  className?: string;
}

interface StageInfo {
  stage: EvaluationStage;
  label: string;
  description: string;
}

const stages: StageInfo[] = [
  {
    stage: "L1",
    label: "L1: Submission",
    description: "Initial screening & validation",
  },
  {
    stage: "L2",
    label: "L2: Department Review",
    description: "Technical & feasibility assessment",
  },
  {
    stage: "L3",
    label: "L3: Business Case",
    description: "ROI & cost-benefit analysis",
  },
  {
    stage: "L4",
    label: "L4: Executive Approval",
    description: "Strategic alignment & decision",
  },
  {
    stage: "L5",
    label: "L5: Implementation",
    description: "Execution & benefit tracking",
  },
];

const getStageStatusIcon = (
  stage: EvaluationStage,
  currentStage: EvaluationStage,
  stageStatus: StageStatus,
  completedStages: EvaluationStage[]
) => {
  const isCompleted = completedStages.includes(stage);
  const isCurrent = stage === currentStage;

  if (isCompleted) {
    return <Check className="h-5 w-5 text-white" />;
  }

  if (isCurrent) {
    if (stageStatus === "approved") {
      return <Check className="h-5 w-5 text-white" />;
    } else if (stageStatus === "rejected") {
      return <XCircle className="h-5 w-5 text-white" />;
    } else if (stageStatus === "on-hold") {
      return <AlertCircle className="h-5 w-5 text-white" />;
    } else if (stageStatus === "in-review") {
      return <Clock className="h-5 w-5 text-white" />;
    } else {
      return <Circle className="h-5 w-5 text-white" />;
    }
  }

  return <Circle className="h-5 w-5 text-muted-foreground" />;
};

const getStageColor = (
  stage: EvaluationStage,
  currentStage: EvaluationStage,
  stageStatus: StageStatus,
  completedStages: EvaluationStage[]
) => {
  const isCompleted = completedStages.includes(stage);
  const isCurrent = stage === currentStage;

  if (isCompleted) {
    return "bg-success border-success";
  }

  if (isCurrent) {
    if (stageStatus === "approved") {
      return "bg-success border-success";
    } else if (stageStatus === "rejected") {
      return "bg-destructive border-destructive";
    } else if (stageStatus === "on-hold") {
      return "bg-warning border-warning";
    } else if (stageStatus === "in-review") {
      return "bg-info border-info";
    } else {
      return "bg-primary border-primary";
    }
  }

  return "bg-muted border-border";
};

const getConnectorColor = (
  fromStage: EvaluationStage,
  currentStage: EvaluationStage,
  completedStages: EvaluationStage[]
) => {
  const fromCompleted = completedStages.includes(fromStage);

  if (fromCompleted) {
    return "bg-success";
  }

  return "bg-border";
};

const StageProgressIndicator: React.FC<StageProgressIndicatorProps> = ({
  currentStage,
  stageStatus,
  completedStages = [],
  className,
}) => {
  const currentStageIndex = stages.findIndex((s) => s.stage === currentStage);

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop View - Horizontal Stepper */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {stages.map((stageInfo, index) => {
            const isLast = index === stages.length - 1;

            return (
              <div key={stageInfo.stage} className="flex items-center flex-1">
                {/* Stage Circle & Content */}
                <div className="flex flex-col items-center relative z-10">
                  {/* Circle */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      getStageColor(
                        stageInfo.stage,
                        currentStage,
                        stageStatus,
                        completedStages
                      )
                    )}
                  >
                    {getStageStatusIcon(
                      stageInfo.stage,
                      currentStage,
                      stageStatus,
                      completedStages
                    )}
                  </div>

                  {/* Label & Description */}
                  <div className="mt-3 text-center max-w-[120px]">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        index <= currentStageIndex
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {stageInfo.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stageInfo.description}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="flex-1 h-0.5 mx-2 relative -top-8">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        getConnectorColor(
                          stageInfo.stage,
                          currentStage,
                          completedStages
                        )
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile View - Vertical Stepper */}
      <div className="md:hidden">
        <div className="space-y-4">
          {stages.map((stageInfo, index) => {
            const isLast = index === stages.length - 1;

            return (
              <div key={stageInfo.stage} className="flex gap-4">
                {/* Left Side - Circle & Connector */}
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0",
                      getStageColor(
                        stageInfo.stage,
                        currentStage,
                        stageStatus,
                        completedStages
                      )
                    )}
                  >
                    {getStageStatusIcon(
                      stageInfo.stage,
                      currentStage,
                      stageStatus,
                      completedStages
                    )}
                  </div>

                  {/* Vertical Connector */}
                  {!isLast && (
                    <div className="w-0.5 flex-1 min-h-[40px] mt-2">
                      <div
                        className={cn(
                          "h-full transition-all duration-300",
                          getConnectorColor(
                            stageInfo.stage,
                            currentStage,
                            completedStages
                          )
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Right Side - Content */}
                <div className="flex-1 pb-4">
                  <p
                    className={cn(
                      "text-base font-semibold",
                      index <= currentStageIndex
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {stageInfo.label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stageInfo.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Legend */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          Status Legend:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-info" />
            <span>In Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span>On Hold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span>Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageProgressIndicator;
