export type RAGStatus = 'green' | 'amber' | 'red';

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
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  targetDate: string;
  completedDate?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
  description?: string;
  order: number;
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
