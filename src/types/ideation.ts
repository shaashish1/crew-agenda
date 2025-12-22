// L1-L5 Ideation Framework Types

export type EvaluationStage = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
export type StageStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'on_hold';

export interface Department {
  id: string;
  name: string;
  code: string;
  head_name: string | null;
  head_email: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EnhancedIdea {
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
  // L1-L5 fields
  department_id: string | null;
  evaluation_stage: EvaluationStage;
  stage_status: StageStatus;
  submitter_name: string | null;
  submitter_email: string | null;
  submitter_employee_id: string | null;
  submission_date: string | null;
  // L2 Screening
  l2_novelty_score: number | null;
  l2_feasibility_score: number | null;
  l2_alignment_score: number | null;
  l2_impact_score: number | null;
  l2_overall_score: number | null;
  l2_screening_date: string | null;
  l2_screened_by: string | null;
  l2_comments: string | null;
  // L3 Feasibility
  l3_technical_feasibility: string | null;
  l3_resource_requirements: string | null;
  l3_timeline_estimate: string | null;
  l3_risk_assessment: string | null;
  l3_dependencies: string | null;
  l3_feasibility_score: number | null;
  l3_assessment_date: string | null;
  l3_assessed_by: string | null;
  l3_comments: string | null;
  // L4 Business Case
  l4_estimated_cost: number | null;
  l4_estimated_benefits: number | null;
  l4_roi_percentage: number | null;
  l4_payback_period_months: number | null;
  l4_npv: number | null;
  l4_strategic_fit_score: number | null;
  l4_market_potential: string | null;
  l4_competitive_advantage: string | null;
  l4_approval_date: string | null;
  l4_approved_by: string | null;
  l4_comments: string | null;
  // L5 Implementation
  l5_project_lead: string | null;
  l5_team_members: string[] | null;
  l5_start_date: string | null;
  l5_target_completion_date: string | null;
  l5_actual_completion_date: string | null;
  l5_implementation_status: string | null;
  l5_milestones: any | null;
  l5_progress_percentage: number | null;
  l5_lessons_learned: string | null;
  l5_comments: string | null;
  // Timestamps
  l1_completed_at: string | null;
  l2_completed_at: string | null;
  l3_completed_at: string | null;
  l4_completed_at: string | null;
  l5_completed_at: string | null;
  // Joined data
  department?: Department;
}

export interface IdeaReview {
  id: string;
  idea_id: string;
  reviewer_name: string;
  reviewer_email: string | null;
  stage: EvaluationStage;
  novelty_score: number | null;
  feasibility_score: number | null;
  alignment_score: number | null;
  impact_score: number | null;
  overall_score: number | null;
  recommendation: string | null;
  comments: string | null;
  review_date: string;
  created_at: string;
  updated_at: string;
}

export interface IdeaStageHistory {
  id: string;
  idea_id: string;
  from_stage: EvaluationStage | null;
  to_stage: EvaluationStage;
  from_status: StageStatus | null;
  to_status: StageStatus;
  changed_by: string;
  change_reason: string | null;
  created_at: string;
}

export interface IdeaComment {
  id: string;
  idea_id: string;
  author_name: string;
  author_email: string | null;
  content: string;
  parent_comment_id: string | null;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
}

export interface IdeaAttachment {
  id: string;
  idea_id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_by: string;
  created_at: string;
}

export interface StageStatistics {
  stage: EvaluationStage;
  total: number;
  pending: number;
  in_progress: number;
  approved: number;
  rejected: number;
}
