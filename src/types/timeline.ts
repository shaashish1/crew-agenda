import { Milestone } from './project';

export interface TimelineTrack {
  type: 'baseline' | 'current';
  milestones: MilestoneNode[];
  label: string;
  color: string;
}

export interface MilestoneNode {
  milestone: Milestone;
  position: number; // X-axis position (days from project start)
  isBranchPoint: boolean;
  delayDays: number;
  connections: Connection[];
  yPosition: number; // Y-axis position for track
}

export interface Connection {
  from: MilestoneNode;
  to: MilestoneNode;
  type: 'sequential' | 'branch' | 'dependency';
  isBaseline: boolean;
}

export interface TimelineStats {
  totalMilestones: number;
  delayedMilestones: number;
  averageDelayDays: number;
  maxDelayDays: number;
  branchPointDate: string | null;
  criticalPathImpacted: boolean;
}

export interface DelayInfo {
  milestoneId: string;
  milestoneName: string;
  baselineDate: string;
  revisedDate: string;
  delayDays: number;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
}
