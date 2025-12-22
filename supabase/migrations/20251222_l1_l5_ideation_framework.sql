-- ============================================================================
-- SYNGENE IDEATION PORTAL: L1-L5 EVALUATION FRAMEWORK
-- Migration: Enhanced Idea Management with Multi-Stage Evaluation
-- Created: 2025-12-22
-- ============================================================================

-- ============================================================================
-- 1. CREATE DEPARTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  head_name TEXT,
  head_email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert standard departments
INSERT INTO public.departments (name, code, description) VALUES
  ('Chemistry', 'CHEM', 'Chemistry Department - R&D and Lab Operations'),
  ('EHSS', 'EHSS', 'Environment, Health, Safety & Security'),
  ('Sourcing', 'SORC', 'Sourcing and Procurement'),
  ('T&CR', 'TECH', 'Technical & Customer Relations'),
  ('HR', 'HR', 'Human Resources'),
  ('Biology', 'BIO', 'Biology Department'),
  ('Finance', 'FIN', 'Finance and Accounting'),
  ('Commercial', 'COMM', 'Commercial and Business Development'),
  ('Quality', 'QA', 'Quality Assurance'),
  ('Biologics', 'BIOL', 'Biologics Department'),
  ('IT', 'IT', 'Information Technology'),
  ('Operations', 'OPS', 'Operations'),
  ('Regulatory', 'REG', 'Regulatory Affairs')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 2. ENHANCE IDEAS TABLE WITH L1-L5 FRAMEWORK
-- ============================================================================

-- Add L1-L5 evaluation fields
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS evaluation_stage TEXT NOT NULL DEFAULT 'L1',
ADD COLUMN IF NOT EXISTS stage_status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS submitting_department_id UUID REFERENCES public.departments(id),
ADD COLUMN IF NOT EXISTS affected_departments UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS assigned_reviewers UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS stage_entered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS time_in_stage_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_evaluation_days INTEGER DEFAULT 0;

-- Add L2: Department Review & Scoring fields
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS l2_technical_feasibility DECIMAL(3,2) CHECK (l2_technical_feasibility >= 0 AND l2_technical_feasibility <= 5),
ADD COLUMN IF NOT EXISTS l2_resource_availability DECIMAL(3,2) CHECK (l2_resource_availability >= 0 AND l2_resource_availability <= 5),
ADD COLUMN IF NOT EXISTS l2_timeline_feasibility DECIMAL(3,2) CHECK (l2_timeline_feasibility >= 0 AND l2_timeline_feasibility <= 5),
ADD COLUMN IF NOT EXISTS l2_department_fit DECIMAL(3,2) CHECK (l2_department_fit >= 0 AND l2_department_fit <= 5),
ADD COLUMN IF NOT EXISTS l2_overall_score DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS l2_comments TEXT,
ADD COLUMN IF NOT EXISTS l2_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS l2_completed_by UUID;

-- Add L3: Business Case Development fields
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS l3_estimated_cost DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS l3_expected_savings DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS l3_roi_percentage DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS l3_payback_period_months INTEGER,
ADD COLUMN IF NOT EXISTS l3_implementation_timeline TEXT,
ADD COLUMN IF NOT EXISTS l3_npv DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS l3_irr DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS l3_capex DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS l3_opex DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS l3_headcount_impact INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS l3_business_case_document TEXT,
ADD COLUMN IF NOT EXISTS l3_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS l3_completed_by UUID;

-- Add L4: Executive Review & Approval fields
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS l4_strategic_alignment DECIMAL(3,2) CHECK (l4_strategic_alignment >= 0 AND l4_strategic_alignment <= 5),
ADD COLUMN IF NOT EXISTS l4_portfolio_fit DECIMAL(3,2) CHECK (l4_portfolio_fit >= 0 AND l4_portfolio_fit <= 5),
ADD COLUMN IF NOT EXISTS l4_risk_level TEXT CHECK (l4_risk_level IN ('low', 'medium', 'high', 'critical')),
ADD COLUMN IF NOT EXISTS l4_final_decision TEXT CHECK (l4_final_decision IN ('approved', 'rejected', 'on-hold', 'pending')),
ADD COLUMN IF NOT EXISTS l4_executive_comments TEXT,
ADD COLUMN IF NOT EXISTS l4_approved_budget DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS l4_conditions TEXT,
ADD COLUMN IF NOT EXISTS l4_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS l4_approved_by UUID;

-- Add L5: Implementation Tracking fields
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS l5_converted_to_project_id UUID,
ADD COLUMN IF NOT EXISTS l5_implementation_start_date DATE,
ADD COLUMN IF NOT EXISTS l5_implementation_end_date DATE,
ADD COLUMN IF NOT EXISTS l5_actual_cost DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS l5_actual_savings DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS l5_actual_roi DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS l5_lessons_learned TEXT,
ADD COLUMN IF NOT EXISTS l5_completed_at TIMESTAMP WITH TIME ZONE;

-- Add compliance and risk management fields
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS compliance_requirements TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS risk_assessment_level TEXT CHECK (risk_assessment_level IN ('low', 'medium', 'high', 'critical')),
ADD COLUMN IF NOT EXISTS risk_mitigation_plan TEXT,
ADD COLUMN IF NOT EXISTS regulatory_impact TEXT,
ADD COLUMN IF NOT EXISTS requires_compliance_review BOOLEAN DEFAULT false;

-- Add collaboration fields
ALTER TABLE public.ideas
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'department', 'confidential')),
ADD COLUMN IF NOT EXISTS is_duplicate BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS duplicate_of_idea_id UUID REFERENCES public.ideas(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ideas_evaluation_stage ON public.ideas(evaluation_stage);
CREATE INDEX IF NOT EXISTS idx_ideas_stage_status ON public.ideas(stage_status);
CREATE INDEX IF NOT EXISTS idx_ideas_submitting_dept ON public.ideas(submitting_department_id);
CREATE INDEX IF NOT EXISTS idx_ideas_stage_entered_at ON public.ideas(stage_entered_at);
CREATE INDEX IF NOT EXISTS idx_ideas_l4_decision ON public.ideas(l4_final_decision);

-- ============================================================================
-- 3. CREATE IDEA_REVIEWS TABLE (Multi-Reviewer System)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.idea_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  reviewer_role TEXT NOT NULL CHECK (reviewer_role IN ('department_head', 'technical_expert', 'finance_reviewer', 'executive', 'compliance_officer')),
  review_stage TEXT NOT NULL CHECK (review_stage IN ('L1', 'L2', 'L3', 'L4', 'L5')),
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'in-progress', 'completed', 'declined')),

  -- Scoring fields (1-5 scale)
  technical_score DECIMAL(3,2) CHECK (technical_score >= 0 AND technical_score <= 5),
  feasibility_score DECIMAL(3,2) CHECK (feasibility_score >= 0 AND feasibility_score <= 5),
  business_value_score DECIMAL(3,2) CHECK (business_value_score >= 0 AND business_value_score <= 5),
  risk_score DECIMAL(3,2) CHECK (risk_score >= 0 AND risk_score <= 5),
  overall_score DECIMAL(3,2) CHECK (overall_score >= 0 AND overall_score <= 5),

  -- Review details
  review_comments TEXT,
  recommendation TEXT CHECK (recommendation IN ('approve', 'reject', 'needs-revision', 'on-hold')),
  concerns TEXT,
  suggested_improvements TEXT,

  -- Department-specific fields
  department_id UUID REFERENCES public.departments(id),
  custom_criteria JSONB DEFAULT '{}',

  -- Timestamps
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_idea_reviews_idea_id ON public.idea_reviews(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_reviews_reviewer_id ON public.idea_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_idea_reviews_stage ON public.idea_reviews(review_stage);
CREATE INDEX IF NOT EXISTS idx_idea_reviews_status ON public.idea_reviews(review_status);

-- ============================================================================
-- 4. CREATE IDEA_STAGE_HISTORY TABLE (Audit Trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.idea_stage_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  from_stage TEXT,
  to_stage TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by UUID NOT NULL,
  changed_by_name TEXT,
  reason TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stage_history_idea_id ON public.idea_stage_history(idea_id);
CREATE INDEX IF NOT EXISTS idx_stage_history_created_at ON public.idea_stage_history(created_at);

-- ============================================================================
-- 5. CREATE IDEA_COMMENTS TABLE (Collaboration)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.idea_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.idea_comments(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  comment_type TEXT NOT NULL DEFAULT 'general' CHECK (comment_type IN ('general', 'question', 'feedback', 'concern', 'approval')),
  author_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  author_department_id UUID REFERENCES public.departments(id),
  mentions UUID[] DEFAULT '{}',
  is_internal BOOLEAN DEFAULT false,
  stage_context TEXT,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_idea_comments_idea_id ON public.idea_comments(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_comments_author_id ON public.idea_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_idea_comments_created_at ON public.idea_comments(created_at DESC);

-- ============================================================================
-- 6. CREATE IDEA_ATTACHMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.idea_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID NOT NULL,
  uploaded_by_name TEXT,
  description TEXT,
  stage TEXT,
  category TEXT CHECK (category IN ('business-case', 'technical-doc', 'financial-analysis', 'compliance', 'other')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_idea_attachments_idea_id ON public.idea_attachments(idea_id);

-- ============================================================================
-- 7. CREATE DEPARTMENT_EVALUATION_CRITERIA TABLE (Configurable Criteria)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.department_evaluation_criteria (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('L1', 'L2', 'L3', 'L4', 'L5')),
  criterion_name TEXT NOT NULL,
  criterion_description TEXT,
  weight DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  is_mandatory BOOLEAN DEFAULT false,
  evaluation_type TEXT CHECK (evaluation_type IN ('score', 'yes-no', 'text', 'checklist')),
  options JSONB DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(department_id, stage, criterion_name)
);

CREATE INDEX IF NOT EXISTS idx_dept_criteria_dept_stage ON public.department_evaluation_criteria(department_id, stage);

-- ============================================================================
-- 8. ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_evaluation_criteria ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 9. CREATE RLS POLICIES (Permissive for now - adjust based on auth)
-- ============================================================================

-- Departments policies
CREATE POLICY "Anyone can view departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL USING (true);

-- Idea Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.idea_reviews FOR SELECT USING (true);
CREATE POLICY "Reviewers can create reviews" ON public.idea_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Reviewers can update their reviews" ON public.idea_reviews FOR UPDATE USING (true);
CREATE POLICY "Admins can delete reviews" ON public.idea_reviews FOR DELETE USING (true);

-- Stage History policies
CREATE POLICY "Anyone can view stage history" ON public.idea_stage_history FOR SELECT USING (true);
CREATE POLICY "System can create stage history" ON public.idea_stage_history FOR INSERT WITH CHECK (true);

-- Comments policies
CREATE POLICY "Anyone can view non-deleted comments" ON public.idea_comments FOR SELECT USING (is_deleted = false OR true);
CREATE POLICY "Users can create comments" ON public.idea_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Authors can update their comments" ON public.idea_comments FOR UPDATE USING (true);
CREATE POLICY "Authors can delete their comments" ON public.idea_comments FOR DELETE USING (true);

-- Attachments policies
CREATE POLICY "Anyone can view attachments" ON public.idea_attachments FOR SELECT USING (true);
CREATE POLICY "Users can upload attachments" ON public.idea_attachments FOR INSERT WITH CHECK (true);
CREATE POLICY "Uploaders can delete attachments" ON public.idea_attachments FOR DELETE USING (true);

-- Department Criteria policies
CREATE POLICY "Anyone can view criteria" ON public.department_evaluation_criteria FOR SELECT USING (true);
CREATE POLICY "Admins can manage criteria" ON public.department_evaluation_criteria FOR ALL USING (true);

-- ============================================================================
-- 10. CREATE TRIGGERS FOR UPDATED_AT
-- ============================================================================
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_idea_reviews_updated_at BEFORE UPDATE ON public.idea_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_idea_comments_updated_at BEFORE UPDATE ON public.idea_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dept_criteria_updated_at BEFORE UPDATE ON public.department_evaluation_criteria
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 11. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate L2 overall score
CREATE OR REPLACE FUNCTION calculate_l2_overall_score(idea_id UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  avg_score DECIMAL(3,2);
BEGIN
  SELECT (
    COALESCE(l2_technical_feasibility, 0) +
    COALESCE(l2_resource_availability, 0) +
    COALESCE(l2_timeline_feasibility, 0) +
    COALESCE(l2_department_fit, 0)
  ) / 4.0
  INTO avg_score
  FROM ideas WHERE id = idea_id;

  RETURN avg_score;
END;
$$ LANGUAGE plpgsql;

-- Function to track stage transitions
CREATE OR REPLACE FUNCTION track_stage_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- Only track if stage or status changed
  IF (OLD.evaluation_stage != NEW.evaluation_stage OR OLD.stage_status != NEW.stage_status) THEN
    INSERT INTO idea_stage_history (
      idea_id,
      from_stage,
      to_stage,
      from_status,
      to_status,
      changed_by,
      notes
    ) VALUES (
      NEW.id,
      OLD.evaluation_stage,
      NEW.evaluation_stage,
      OLD.stage_status,
      NEW.stage_status,
      NEW.created_by,
      'Stage transition via system'
    );

    -- Update stage timing
    NEW.stage_entered_at = now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to ideas table
DROP TRIGGER IF EXISTS track_idea_stage_transition ON public.ideas;
CREATE TRIGGER track_idea_stage_transition
  BEFORE UPDATE ON public.ideas
  FOR EACH ROW
  EXECUTE FUNCTION track_stage_transition();

-- ============================================================================
-- 12. CREATE VIEWS FOR ANALYTICS
-- ============================================================================

-- View: Ideas by stage and department
CREATE OR REPLACE VIEW idea_stage_summary AS
SELECT
  evaluation_stage,
  stage_status,
  d.name as department_name,
  COUNT(*) as idea_count,
  AVG(time_in_stage_days) as avg_days_in_stage,
  AVG(l2_overall_score) as avg_l2_score
FROM ideas i
LEFT JOIN departments d ON i.submitting_department_id = d.id
GROUP BY evaluation_stage, stage_status, d.name;

-- View: Review workload by reviewer
CREATE OR REPLACE VIEW reviewer_workload AS
SELECT
  reviewer_id,
  reviewer_name,
  review_stage,
  COUNT(*) FILTER (WHERE review_status = 'pending') as pending_reviews,
  COUNT(*) FILTER (WHERE review_status = 'in-progress') as in_progress_reviews,
  COUNT(*) FILTER (WHERE review_status = 'completed') as completed_reviews,
  AVG(EXTRACT(EPOCH FROM (completed_at - assigned_at))/3600) as avg_hours_to_complete
FROM idea_reviews
GROUP BY reviewer_id, reviewer_name, review_stage;

-- View: Idea funnel metrics
CREATE OR REPLACE VIEW idea_funnel_metrics AS
SELECT
  COUNT(*) FILTER (WHERE evaluation_stage = 'L1') as l1_ideas,
  COUNT(*) FILTER (WHERE evaluation_stage = 'L2') as l2_ideas,
  COUNT(*) FILTER (WHERE evaluation_stage = 'L3') as l3_ideas,
  COUNT(*) FILTER (WHERE evaluation_stage = 'L4') as l4_ideas,
  COUNT(*) FILTER (WHERE evaluation_stage = 'L5') as l5_ideas,
  COUNT(*) FILTER (WHERE l4_final_decision = 'approved') as approved_ideas,
  COUNT(*) FILTER (WHERE l4_final_decision = 'rejected') as rejected_ideas,
  SUM(l3_expected_savings) FILTER (WHERE l4_final_decision = 'approved') as total_expected_savings,
  SUM(l5_actual_savings) FILTER (WHERE evaluation_stage = 'L5') as total_realized_savings
FROM ideas;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
