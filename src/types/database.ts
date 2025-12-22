// ============================================================================
// SYNGENE IDEATION PORTAL - TYPE DEFINITIONS
// Enhanced types for L1-L5 Evaluation Framework
// ============================================================================

// Evaluation Stages
export type EvaluationStage = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
export type StageStatus = 'pending' | 'in-review' | 'approved' | 'rejected' | 'on-hold';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type FinalDecision = 'approved' | 'rejected' | 'on-hold' | 'pending';
export type IdeaVisibility = 'public' | 'department' | 'confidential';

// L2 Scoring Interface
export interface L2Scores {
  technical_feasibility: number;
  resource_availability: number;
  timeline_feasibility: number;
  department_fit: number;
  overall_score: number;
  comments?: string;
  completed_at?: string;
  completed_by?: string;
}

// L3 Business Case Interface
export interface L3BusinessCase {
  estimated_cost: number;
  expected_savings: number;
  roi_percentage: number;
  payback_period_months: number;
  implementation_timeline: string;
  npv?: number;
  irr?: number;
  capex?: number;
  opex?: number;
  headcount_impact?: number;
  business_case_document?: string;
  completed_at?: string;
  completed_by?: string;
}

// L4 Executive Review Interface
export interface L4ExecutiveReview {
  strategic_alignment: number;
  portfolio_fit: number;
  risk_level: RiskLevel;
  final_decision: FinalDecision;
  executive_comments?: string;
  approved_budget?: number;
  conditions?: string;
  completed_at?: string;
  approved_by?: string;
}

// L5 Implementation Tracking Interface
export interface L5Implementation {
  converted_to_project_id?: string;
  implementation_start_date?: string;
  implementation_end_date?: string;
  actual_cost?: number;
  actual_savings?: number;
  actual_roi?: number;
  lessons_learned?: string;
  completed_at?: string;
}

// Enhanced Idea Interface with L1-L5 Framework
export interface Idea {
  // Basic Fields
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  problem_statement: string | null;
  proposed_solution: string | null;
  expected_benefits: string | null;
  remarks: string | null;

  // L1-L5 Framework Fields
  evaluation_stage: EvaluationStage;
  stage_status: StageStatus;
  submitting_department_id?: string;
  affected_departments?: string[];
  assigned_reviewers?: string[];
  stage_entered_at?: string;
  time_in_stage_days?: number;
  total_evaluation_days?: number;

  // L2: Department Review & Scoring
  l2_technical_feasibility?: number;
  l2_resource_availability?: number;
  l2_timeline_feasibility?: number;
  l2_department_fit?: number;
  l2_overall_score?: number;
  l2_comments?: string;
  l2_completed_at?: string;
  l2_completed_by?: string;

  // L3: Business Case Development
  l3_estimated_cost?: number;
  l3_expected_savings?: number;
  l3_roi_percentage?: number;
  l3_payback_period_months?: number;
  l3_implementation_timeline?: string;
  l3_npv?: number;
  l3_irr?: number;
  l3_capex?: number;
  l3_opex?: number;
  l3_headcount_impact?: number;
  l3_business_case_document?: string;
  l3_completed_at?: string;
  l3_completed_by?: string;

  // L4: Executive Review & Approval
  l4_strategic_alignment?: number;
  l4_portfolio_fit?: number;
  l4_risk_level?: RiskLevel;
  l4_final_decision?: FinalDecision;
  l4_executive_comments?: string;
  l4_approved_budget?: number;
  l4_conditions?: string;
  l4_completed_at?: string;
  l4_approved_by?: string;

  // L5: Implementation Tracking
  l5_converted_to_project_id?: string;
  l5_implementation_start_date?: string;
  l5_implementation_end_date?: string;
  l5_actual_cost?: number;
  l5_actual_savings?: number;
  l5_actual_roi?: number;
  l5_lessons_learned?: string;
  l5_completed_at?: string;

  // Compliance & Risk
  compliance_requirements?: string[];
  risk_assessment_level?: RiskLevel;
  risk_mitigation_plan?: string;
  regulatory_impact?: string;
  requires_compliance_review?: boolean;

  // Collaboration
  tags?: string[];
  visibility?: IdeaVisibility;
  is_duplicate?: boolean;
  duplicate_of_idea_id?: string;
}

// Department Interface
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  head_name?: string;
  head_email?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Reviewer Role Types
export type ReviewerRole =
  | 'department_head'
  | 'technical_expert'
  | 'finance_reviewer'
  | 'executive'
  | 'compliance_officer';

export type ReviewStatus = 'pending' | 'in-progress' | 'completed' | 'declined';
export type ReviewRecommendation = 'approve' | 'reject' | 'needs-revision' | 'on-hold';

// Idea Review Interface
export interface IdeaReview {
  id: string;
  idea_id: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewer_email?: string;
  reviewer_role: ReviewerRole;
  review_stage: EvaluationStage;
  review_status: ReviewStatus;

  // Scoring (1-5 scale)
  technical_score?: number;
  feasibility_score?: number;
  business_value_score?: number;
  risk_score?: number;
  overall_score?: number;

  // Review Details
  review_comments?: string;
  recommendation?: ReviewRecommendation;
  concerns?: string;
  suggested_improvements?: string;

  // Department-specific
  department_id?: string;
  custom_criteria?: Record<string, any>;

  // Timestamps
  assigned_at: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Stage History Interface (Audit Trail)
export interface IdeaStageHistory {
  id: string;
  idea_id: string;
  from_stage?: EvaluationStage;
  to_stage: EvaluationStage;
  from_status?: StageStatus;
  to_status: StageStatus;
  changed_by: string;
  changed_by_name?: string;
  reason?: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Comment Types
export type CommentType = 'general' | 'question' | 'feedback' | 'concern' | 'approval';

// Idea Comment Interface
export interface IdeaComment {
  id: string;
  idea_id: string;
  parent_comment_id?: string;
  comment_text: string;
  comment_type: CommentType;
  author_id: string;
  author_name: string;
  author_email?: string;
  author_department_id?: string;
  mentions?: string[];
  is_internal: boolean;
  stage_context?: EvaluationStage;
  attachments?: any[];
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

// Attachment Category Types
export type AttachmentCategory =
  | 'business-case'
  | 'technical-doc'
  | 'financial-analysis'
  | 'compliance'
  | 'other';

// Idea Attachment Interface
export interface IdeaAttachment {
  id: string;
  idea_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  storage_path: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  description?: string;
  stage?: EvaluationStage;
  category?: AttachmentCategory;
  created_at: string;
}

// Evaluation Criteria Types
export type EvaluationType = 'score' | 'yes-no' | 'text' | 'checklist';

// Department Evaluation Criteria Interface
export interface DepartmentEvaluationCriteria {
  id: string;
  department_id: string;
  stage: EvaluationStage;
  criterion_name: string;
  criterion_description?: string;
  weight: number;
  is_mandatory: boolean;
  evaluation_type: EvaluationType;
  options?: Record<string, any>;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectBlueprint {
  id: string;
  project_id: string;
  purpose: string;
  validation_criteria: string[];
  success_metrics: string[];
  assumptions: string[];
  constraints: string[];
  created_at: string;
  updated_at: string;
}

export interface DocumentRecord {
  id: string;
  project_id: string;
  name: string;
  type: string;
  upload_date: string;
  phase: string;
  status: string;
  version: string;
  url: string | null;
  content: string | null;
  editor_state: any | null;
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  parent_task_id: string;
  title: string;
  status: string;
  owner: string[];
  target_date?: string;
  completion_date?: string;
  order_index: number;
  progress_comments?: string;
  created_at: string;
  updated_at: string;
}
