export type RAGStatus = 'green' | 'amber' | 'red';

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  projectManager: string;
  businessOwner: string;
  projectTeam: string[];
  
  // Project Cost
  tco: number;
  capex: number;
  opex: number;
  actualSpent: number;
  
  // Project Timeline
  startDate: string;
  goLiveDate: string;
  hypercareEndDate: string;
  
  // Content sections
  projectOverview: string;
  businessBenefits: string;
  projectValueDelivery: string;
  
  // Current Status with RAG
  currentStatus: string;
  comments: Comment[];
  overallRAG: RAGStatus;
  timelineRAG: RAGStatus;
  budgetRAG: RAGStatus;
  scopeRAG: RAGStatus;
  
  // Key Activities
  keyActivities: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastStatusUpdate?: string;
  
  // Performance Metrics
  performanceMetrics?: PerformanceMetrics;
  
  // Resource Utilization
  resourceUtilization?: ResourceUtilization[];
}

export interface ResourceUtilization {
  department: string;
  totalResources: number;
  allocatedPercentage: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  targetDate: string;
  baselineTargetDate?: string; // For baseline comparison
  completedDate?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed' | 'at-risk';
  description?: string;
  order: number;
  dependencies?: string[]; // Array of milestone IDs
  isCriticalPath?: boolean;
  approvalRequired?: boolean;
  approvedBy?: string;
  approvedDate?: string;
}

export interface Risk {
  id: string;
  projectId: string;
  riskNumber: string;
  riskDetails: string;
  mitigationPlan: string;
  riskReportedDate: string;
  targetCompletionDate: string;
  owner: string;
  status: 'open' | 'in-progress' | 'mitigated' | 'closed';
  ragStatus: RAGStatus;
}

export interface StatusUpdate {
  id: string;
  projectId: string;
  updateDate: string;
  updateType: 'daily' | 'weekly';
  summary: string;
  accomplishments: string;
  challenges: string;
  nextSteps: string;
  overallRAG: RAGStatus;
  createdBy: string;
}

export interface Document {
  id: string;
  projectId: string;
  name: string;
  type: string;
  uploadDate: string;
  phase: string;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  version: string;
  url?: string;
}

export type PerformanceRating = 'critical' | 'high' | 'medium' | 'low';

export interface PerformanceCriteria {
  driver: string;
  criteria: string;
  critical: string;
  high: string;
  medium: string;
  low: string;
}

export interface PerformanceMetrics {
  projectDelayPercentage: number; // 0-100
  userAdoptionRate: number | null; // 0-100, null until 6 months post go-live
  performanceRating: PerformanceRating;
  adoptionMeasurementDate?: string; // When adoption was measured
  lastCalculated: string; // Last time metrics were calculated
}
