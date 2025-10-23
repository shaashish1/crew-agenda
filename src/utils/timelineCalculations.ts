import { Milestone } from '@/types/project';
import { MilestoneNode, TimelineTrack, TimelineStats, DelayInfo, Connection } from '@/types/timeline';
import { differenceInDays, parseISO, min } from 'date-fns';

export const calculateTimelineStats = (milestones: Milestone[]): TimelineStats => {
  const delayedMilestones = milestones.filter(m => 
    m.baselineTargetDate && m.targetDate !== m.baselineTargetDate
  );

  const delays = delayedMilestones.map(m => 
    Math.abs(differenceInDays(parseISO(m.targetDate), parseISO(m.baselineTargetDate!)))
  );

  const averageDelay = delays.length > 0 
    ? delays.reduce((sum, d) => sum + d, 0) / delays.length 
    : 0;

  const maxDelay = delays.length > 0 ? Math.max(...delays) : 0;

  const branchPoint = delayedMilestones.length > 0 
    ? delayedMilestones.reduce((earliest, m) => 
        new Date(m.targetDate) < new Date(earliest.targetDate) ? m : earliest
      )
    : null;

  const criticalPathImpacted = delayedMilestones.some(m => m.isCriticalPath);

  return {
    totalMilestones: milestones.length,
    delayedMilestones: delayedMilestones.length,
    averageDelayDays: Math.round(averageDelay),
    maxDelayDays: maxDelay,
    branchPointDate: branchPoint ? branchPoint.targetDate : null,
    criticalPathImpacted,
  };
};

export const getDelayInfoList = (milestones: Milestone[]): DelayInfo[] => {
  return milestones
    .filter(m => m.baselineTargetDate && m.targetDate !== m.baselineTargetDate)
    .map(m => {
      const delayDays = differenceInDays(
        parseISO(m.targetDate),
        parseISO(m.baselineTargetDate!)
      );
      
      return {
        milestoneId: m.id,
        milestoneName: m.name,
        baselineDate: m.baselineTargetDate!,
        revisedDate: m.targetDate,
        delayDays: Math.abs(delayDays),
        severity: getDelaySeverity(Math.abs(delayDays)),
      };
    })
    .sort((a, b) => b.delayDays - a.delayDays);
};

export const getDelaySeverity = (delayDays: number): 'minor' | 'moderate' | 'major' | 'critical' => {
  if (delayDays <= 7) return 'minor';
  if (delayDays <= 30) return 'moderate';
  if (delayDays <= 60) return 'major';
  return 'critical';
};

export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'minor': return 'text-success';
    case 'moderate': return 'text-warning';
    case 'major': return 'text-destructive';
    case 'critical': return 'text-destructive';
    default: return 'text-muted-foreground';
  }
};

export const getSeverityBgColor = (severity: string): string => {
  switch (severity) {
    case 'minor': return 'bg-success/10';
    case 'moderate': return 'bg-warning/10';
    case 'major': return 'bg-destructive/10';
    case 'critical': return 'bg-destructive/20';
    default: return 'bg-muted';
  }
};

export const createTimelineTracks = (
  milestones: Milestone[],
  projectStartDate: string
): { baselineTrack: TimelineTrack; currentTrack: TimelineTrack } => {
  if (milestones.length === 0) {
    return {
      baselineTrack: { type: 'baseline', milestones: [], label: 'Original Plan', color: 'hsl(var(--muted))' },
      currentTrack: { type: 'current', milestones: [], label: 'Revised Plan', color: 'hsl(var(--primary))' },
    };
  }

  const startDate = parseISO(projectStartDate);
  
  // Find first delayed milestone (branch point)
  const branchPointMilestone = milestones.find(m => 
    m.baselineTargetDate && m.targetDate !== m.baselineTargetDate
  );

  // Create baseline nodes
  const baselineNodes: MilestoneNode[] = milestones
    .filter(m => m.baselineTargetDate)
    .map((m, idx) => {
      const position = differenceInDays(parseISO(m.baselineTargetDate!), startDate);
      const delayDays = differenceInDays(parseISO(m.targetDate), parseISO(m.baselineTargetDate!));
      
      return {
        milestone: m,
        position,
        isBranchPoint: m.id === branchPointMilestone?.id,
        delayDays: Math.abs(delayDays),
        connections: [],
        yPosition: 0, // Top track
      };
    });

  // Create current nodes
  const currentNodes: MilestoneNode[] = milestones.map((m, idx) => {
    const position = differenceInDays(parseISO(m.targetDate), startDate);
    const delayDays = m.baselineTargetDate 
      ? differenceInDays(parseISO(m.targetDate), parseISO(m.baselineTargetDate))
      : 0;
    
    return {
      milestone: m,
      position,
      isBranchPoint: m.id === branchPointMilestone?.id,
      delayDays: Math.abs(delayDays),
      connections: [],
      yPosition: 1, // Bottom track
    };
  });

  // Create connections
  baselineNodes.forEach((node, idx) => {
    if (idx < baselineNodes.length - 1) {
      node.connections.push({
        from: node,
        to: baselineNodes[idx + 1],
        type: 'sequential',
        isBaseline: true,
      });
    }

    // Branch connection from baseline to current at branch point
    if (node.isBranchPoint) {
      const correspondingCurrent = currentNodes.find(cn => cn.milestone.id === node.milestone.id);
      if (correspondingCurrent) {
        node.connections.push({
          from: node,
          to: correspondingCurrent,
          type: 'branch',
          isBaseline: false,
        });
      }
    }
  });

  currentNodes.forEach((node, idx) => {
    if (idx < currentNodes.length - 1) {
      node.connections.push({
        from: node,
        to: currentNodes[idx + 1],
        type: 'sequential',
        isBaseline: false,
      });
    }
  });

  return {
    baselineTrack: {
      type: 'baseline',
      milestones: baselineNodes,
      label: 'Original Plan',
      color: 'hsl(var(--muted-foreground))',
    },
    currentTrack: {
      type: 'current',
      milestones: currentNodes,
      label: 'Revised Plan',
      color: 'hsl(var(--primary))',
    },
  };
};
