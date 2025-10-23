import { Milestone } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, GitBranch, Clock, TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { 
  calculateTimelineStats, 
  getDelayInfoList, 
  getSeverityColor, 
  getSeverityBgColor,
  createTimelineTracks 
} from "@/utils/timelineCalculations";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MilestoneGitTimelineProps {
  milestones: Milestone[];
  projectStartDate: string;
}

export const MilestoneGitTimeline = ({ milestones, projectStartDate }: MilestoneGitTimelineProps) => {
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);
  const [showOnlyDelayed, setShowOnlyDelayed] = useState(false);

  const stats = calculateTimelineStats(milestones);
  const delayInfo = getDelayInfoList(milestones);
  const { baselineTrack, currentTrack } = createTimelineTracks(milestones, projectStartDate);

  const displayedMilestones = showOnlyDelayed 
    ? milestones.filter(m => m.baselineTargetDate && m.targetDate !== m.baselineTargetDate)
    : milestones;

  // Calculate SVG dimensions
  const maxPosition = Math.max(
    ...currentTrack.milestones.map(n => n.position),
    ...baselineTrack.milestones.map(n => n.position),
    100
  );
  const svgWidth = Math.max(maxPosition * 8 + 200, 800);
  const svgHeight = 400;
  const trackHeight = 150;
  const baselineY = 80;
  const currentY = 240;

  return (
    <div className="space-y-6">
      {/* Statistics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Milestones</p>
                <p className="text-2xl font-bold">{stats.totalMilestones}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delayed</p>
                <p className="text-2xl font-bold text-destructive">{stats.delayedMilestones}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Delay</p>
                <p className="text-2xl font-bold text-warning">{stats.averageDelayDays} days</p>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Path</p>
                <p className="text-2xl font-bold">
                  {stats.criticalPathImpacted ? (
                    <span className="text-destructive">Impacted</span>
                  ) : (
                    <span className="text-success">On Track</span>
                  )}
                </p>
              </div>
              <GitBranch className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Git-Style Timeline Visualization */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Timeline Evolution
            </CardTitle>
            <div className="flex gap-2">
              <Badge 
                variant="outline" 
                className="cursor-pointer"
                onClick={() => setShowOnlyDelayed(!showOnlyDelayed)}
              >
                {showOnlyDelayed ? 'Show All' : 'Show Delayed Only'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-4">
            <TooltipProvider>
              <svg width={svgWidth} height={svgHeight} className="mx-auto">
                {/* Track Labels */}
                <text x="10" y={baselineY} className="text-xs fill-muted-foreground" fontSize="12">
                  Original Plan
                </text>
                <text x="10" y={currentY} className="text-xs fill-primary" fontSize="12" fontWeight="600">
                  Revised Plan
                </text>

                {/* Baseline Track Line */}
                {baselineTrack.milestones.length > 0 && (
                  <line
                    x1={150}
                    y1={baselineY}
                    x2={svgWidth - 50}
                    y2={baselineY}
                    stroke="hsl(var(--muted))"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                )}

                {/* Current Track Line */}
                {currentTrack.milestones.length > 0 && (
                  <line
                    x1={150}
                    y1={currentY}
                    x2={svgWidth - 50}
                    y2={currentY}
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                  />
                )}

                {/* Baseline Milestones */}
                {baselineTrack.milestones.map((node) => {
                  const x = 150 + (node.position / maxPosition) * (svgWidth - 200);
                  const isHovered = hoveredMilestone === node.milestone.id;
                  
                  return (
                    <g key={`baseline-${node.milestone.id}`}>
                      {/* Branch connection line if this is branch point */}
                      {node.isBranchPoint && (
                        <line
                          x1={x}
                          y1={baselineY}
                          x2={x}
                          y2={currentY - 15}
                          stroke="hsl(var(--warning))"
                          strokeWidth="2"
                          strokeDasharray="3,3"
                        />
                      )}
                      
                      {/* Milestone node */}
                      <circle
                        cx={x}
                        cy={baselineY}
                        r={isHovered ? 10 : 8}
                        fill="hsl(var(--background))"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth="2"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setHoveredMilestone(node.milestone.id)}
                        onMouseLeave={() => setHoveredMilestone(null)}
                      />
                      
                      {/* Branch point marker */}
                      {node.isBranchPoint && (
                        <circle
                          cx={x}
                          cy={baselineY}
                          r={12}
                          fill="none"
                          stroke="hsl(var(--warning))"
                          strokeWidth="2"
                        />
                      )}
                      
                      {/* Milestone name */}
                      <text
                        x={x}
                        y={baselineY - 20}
                        textAnchor="middle"
                        className="text-xs fill-muted-foreground"
                        fontSize="10"
                      >
                        {node.milestone.name.slice(0, 15)}{node.milestone.name.length > 15 ? '...' : ''}
                      </text>
                    </g>
                  );
                })}

                {/* Current Milestones */}
                {currentTrack.milestones
                  .filter(node => !showOnlyDelayed || node.delayDays > 0)
                  .map((node) => {
                    const x = 150 + (node.position / maxPosition) * (svgWidth - 200);
                    const isHovered = hoveredMilestone === node.milestone.id;
                    const hasDelay = node.delayDays > 0;
                    
                    return (
                      <g key={`current-${node.milestone.id}`}>
                        {/* Milestone node */}
                        <circle
                          cx={x}
                          cy={currentY}
                          r={isHovered ? 12 : 10}
                          fill={hasDelay ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                          stroke={hasDelay ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                          strokeWidth="3"
                          className="cursor-pointer transition-all"
                          onMouseEnter={() => setHoveredMilestone(node.milestone.id)}
                          onMouseLeave={() => setHoveredMilestone(null)}
                        />
                        
                        {/* Critical path indicator */}
                        {node.milestone.isCriticalPath && (
                          <circle
                            cx={x}
                            cy={currentY}
                            r={15}
                            fill="none"
                            stroke="hsl(var(--destructive))"
                            strokeWidth="2"
                            strokeDasharray="2,2"
                          />
                        )}
                        
                        {/* Milestone name */}
                        <text
                          x={x}
                          y={currentY + 30}
                          textAnchor="middle"
                          className={`text-xs ${hasDelay ? 'fill-destructive' : 'fill-primary'}`}
                          fontSize="11"
                          fontWeight="600"
                        >
                          {node.milestone.name.slice(0, 15)}{node.milestone.name.length > 15 ? '...' : ''}
                        </text>
                        
                        {/* Date */}
                        <text
                          x={x}
                          y={currentY + 45}
                          textAnchor="middle"
                          className="text-xs fill-muted-foreground"
                          fontSize="9"
                        >
                          {format(parseISO(node.milestone.targetDate), 'dd MMM')}
                        </text>

                        {/* Delay indicator */}
                        {hasDelay && (
                          <text
                            x={x}
                            y={currentY + 58}
                            textAnchor="middle"
                            className="text-xs fill-warning"
                            fontSize="9"
                            fontWeight="600"
                          >
                            +{node.delayDays}d
                          </text>
                        )}
                      </g>
                    );
                  })}
              </svg>
            </TooltipProvider>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground bg-background"></div>
              <span className="text-xs text-muted-foreground">Original Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
              <span className="text-xs">Current Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-destructive"></div>
              <span className="text-xs text-destructive">Delayed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-warning bg-transparent"></div>
              <span className="text-xs text-warning">Branch Point</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-dashed border-destructive bg-transparent"></div>
              <span className="text-xs text-destructive">Critical Path</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delay Details Table */}
      {delayInfo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Delay Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {delayInfo.map((delay) => (
                <div 
                  key={delay.milestoneId}
                  className={`p-4 rounded-lg border ${getSeverityBgColor(delay.severity)}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{delay.milestoneName}</h4>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Baseline: </span>
                          <span>{format(parseISO(delay.baselineDate), 'dd MMM yyyy')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Revised: </span>
                          <span className="font-medium">{format(parseISO(delay.revisedDate), 'dd MMM yyyy')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getSeverityColor(delay.severity)}>
                        +{delay.delayDays} days
                      </Badge>
                      <p className={`text-xs mt-1 capitalize ${getSeverityColor(delay.severity)}`}>
                        {delay.severity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
