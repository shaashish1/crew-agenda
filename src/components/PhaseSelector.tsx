import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PHASE_NAMES } from "@/data/documentTemplates";

interface PhaseSelectorProps {
  currentPhase: string;
  onPhaseChange: (phase: string) => void;
  disabled?: boolean;
}

export const PhaseSelector: React.FC<PhaseSelectorProps> = ({ 
  currentPhase, 
  onPhaseChange,
  disabled = false 
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Current Phase:</span>
      <Select value={currentPhase} onValueChange={onPhaseChange} disabled={disabled}>
        <SelectTrigger className="w-[280px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PHASE_NAMES.map((phase) => (
            <SelectItem key={phase} value={phase}>
              <div className="flex items-center gap-2">
                <span>{phase}</span>
                {phase === currentPhase && (
                  <Badge variant="default" className="ml-2 text-xs">Current</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
