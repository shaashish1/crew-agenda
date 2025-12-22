-- Create enum for evaluation stages
CREATE TYPE public.evaluation_stage AS ENUM ('L1', 'L2', 'L3', 'L4', 'L5');
CREATE TYPE public.stage_status AS ENUM ('pending', 'in_progress', 'approved', 'rejected', 'on_hold');

-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  head_name TEXT,
  head_email TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pre-populate departments
INSERT INTO public.departments (name, code, description) VALUES
  ('Chemistry', 'CHEM', 'Chemical research and development'),
  ('Physics', 'PHYS', 'Physical sciences and engineering'),
  ('Biology', 'BIO', 'Biological sciences and life sciences'),
  ('Engineering', 'ENG', 'Mechanical and industrial engineering'),
  ('IT & Digital', 'IT', 'Information technology and digital solutions'),
  ('Operations', 'OPS', 'Operations and process improvement'),
  ('Quality', 'QA', 'Quality assurance and control'),
  ('R&D', 'RND', 'Research and development'),
  ('Supply Chain', 'SCM', 'Supply chain management'),
  ('Manufacturing', 'MFG', 'Manufacturing and production'),
  ('Finance', 'FIN', 'Finance and accounting'),
  ('HR', 'HR', 'Human resources'),
  ('Marketing', 'MKT', 'Marketing and communications');

-- Add L1-L5 columns to ideas table
ALTER TABLE public.ideas 
  ADD COLUMN department_id UUID REFERENCES public.departments(id),
  ADD COLUMN evaluation_stage public.evaluation_stage DEFAULT 'L1',
  ADD COLUMN stage_status public.stage_status DEFAULT 'pending',
  -- Submitter info
  ADD COLUMN submitter_name TEXT,
  ADD COLUMN submitter_email TEXT,
  ADD COLUMN submitter_employee_id TEXT,
  ADD COLUMN submission_date TIMESTAMPTZ DEFAULT now(),
  -- L2 Screening fields
  ADD COLUMN l2_novelty_score NUMERIC(3,2) CHECK (l2_novelty_score >= 0 AND l2_novelty_score <= 5),
  ADD COLUMN l2_feasibility_score NUMERIC(3,2) CHECK (l2_feasibility_score >= 0 AND l2_feasibility_score <= 5),
  ADD COLUMN l2_alignment_score NUMERIC(3,2) CHECK (l2_alignment_score >= 0 AND l2_alignment_score <= 5),
  ADD COLUMN l2_impact_score NUMERIC(3,2) CHECK (l2_impact_score >= 0 AND l2_impact_score <= 5),
  ADD COLUMN l2_overall_score NUMERIC(3,2),
  ADD COLUMN l2_screening_date TIMESTAMPTZ,
  ADD COLUMN l2_screened_by TEXT,
  ADD COLUMN l2_comments TEXT,
  -- L3 Feasibility fields
  ADD COLUMN l3_technical_feasibility TEXT,
  ADD COLUMN l3_resource_requirements TEXT,
  ADD COLUMN l3_timeline_estimate TEXT,
  ADD COLUMN l3_risk_assessment TEXT,
  ADD COLUMN l3_dependencies TEXT,
  ADD COLUMN l3_feasibility_score NUMERIC(3,2),
  ADD COLUMN l3_assessment_date TIMESTAMPTZ,
  ADD COLUMN l3_assessed_by TEXT,
  ADD COLUMN l3_comments TEXT,
  -- L4 Business Case fields
  ADD COLUMN l4_estimated_cost NUMERIC(15,2),
  ADD COLUMN l4_estimated_benefits NUMERIC(15,2),
  ADD COLUMN l4_roi_percentage NUMERIC(7,2),
  ADD COLUMN l4_payback_period_months INTEGER,
  ADD COLUMN l4_npv NUMERIC(15,2),
  ADD COLUMN l4_strategic_fit_score NUMERIC(3,2),
  ADD COLUMN l4_market_potential TEXT,
  ADD COLUMN l4_competitive_advantage TEXT,
  ADD COLUMN l4_approval_date TIMESTAMPTZ,
  ADD COLUMN l4_approved_by TEXT,
  ADD COLUMN l4_comments TEXT,
  -- L5 Implementation fields
  ADD COLUMN l5_project_lead TEXT,
  ADD COLUMN l5_team_members TEXT[],
  ADD COLUMN l5_start_date TIMESTAMPTZ,
  ADD COLUMN l5_target_completion_date TIMESTAMPTZ,
  ADD COLUMN l5_actual_completion_date TIMESTAMPTZ,
  ADD COLUMN l5_implementation_status TEXT DEFAULT 'not_started',
  ADD COLUMN l5_milestones JSONB,
  ADD COLUMN l5_progress_percentage INTEGER DEFAULT 0,
  ADD COLUMN l5_lessons_learned TEXT,
  ADD COLUMN l5_comments TEXT,
  -- Stage transition timestamps
  ADD COLUMN l1_completed_at TIMESTAMPTZ,
  ADD COLUMN l2_completed_at TIMESTAMPTZ,
  ADD COLUMN l3_completed_at TIMESTAMPTZ,
  ADD COLUMN l4_completed_at TIMESTAMPTZ,
  ADD COLUMN l5_completed_at TIMESTAMPTZ;

-- Create idea_reviews table for multi-reviewer system
CREATE TABLE public.idea_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  stage public.evaluation_stage NOT NULL,
  novelty_score NUMERIC(3,2),
  feasibility_score NUMERIC(3,2),
  alignment_score NUMERIC(3,2),
  impact_score NUMERIC(3,2),
  overall_score NUMERIC(3,2),
  recommendation TEXT CHECK (recommendation IN ('approve', 'reject', 'revise', 'escalate')),
  comments TEXT,
  review_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create idea_stage_history for audit trail
CREATE TABLE public.idea_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id TEXT NOT NULL,
  from_stage public.evaluation_stage,
  to_stage public.evaluation_stage NOT NULL,
  from_status public.stage_status,
  to_status public.stage_status NOT NULL,
  changed_by TEXT NOT NULL,
  change_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create idea_comments table
CREATE TABLE public.idea_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.idea_comments(id),
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create idea_attachments table
CREATE TABLE public.idea_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create department_evaluation_criteria table
CREATE TABLE public.department_evaluation_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  stage public.evaluation_stage NOT NULL,
  criteria_name TEXT NOT NULL,
  criteria_description TEXT,
  weight NUMERIC(3,2) DEFAULT 1.0,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(department_id, stage, criteria_name)
);

-- Create indexes
CREATE INDEX idx_ideas_department ON public.ideas(department_id);
CREATE INDEX idx_ideas_evaluation_stage ON public.ideas(evaluation_stage);
CREATE INDEX idx_ideas_stage_status ON public.ideas(stage_status);
CREATE INDEX idx_idea_reviews_idea_id ON public.idea_reviews(idea_id);
CREATE INDEX idx_idea_stage_history_idea_id ON public.idea_stage_history(idea_id);
CREATE INDEX idx_idea_comments_idea_id ON public.idea_comments(idea_id);
CREATE INDEX idx_idea_attachments_idea_id ON public.idea_attachments(idea_id);

-- Create trigger for updated_at on departments
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on idea_reviews
CREATE TRIGGER update_idea_reviews_updated_at
  BEFORE UPDATE ON public.idea_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on idea_comments
CREATE TRIGGER update_idea_comments_updated_at
  BEFORE UPDATE ON public.idea_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on department_evaluation_criteria
CREATE TRIGGER update_department_evaluation_criteria_updated_at
  BEFORE UPDATE ON public.department_evaluation_criteria
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all new tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_evaluation_criteria ENABLE ROW LEVEL SECURITY;

-- RLS Policies for departments (public read, restricted write)
CREATE POLICY "Anyone can view departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Anyone can create departments" ON public.departments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update departments" ON public.departments FOR UPDATE USING (true);

-- RLS Policies for idea_reviews
CREATE POLICY "Anyone can view idea reviews" ON public.idea_reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can create idea reviews" ON public.idea_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update idea reviews" ON public.idea_reviews FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete idea reviews" ON public.idea_reviews FOR DELETE USING (true);

-- RLS Policies for idea_stage_history
CREATE POLICY "Anyone can view stage history" ON public.idea_stage_history FOR SELECT USING (true);
CREATE POLICY "Anyone can create stage history" ON public.idea_stage_history FOR INSERT WITH CHECK (true);

-- RLS Policies for idea_comments
CREATE POLICY "Anyone can view comments" ON public.idea_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can create comments" ON public.idea_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update comments" ON public.idea_comments FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete comments" ON public.idea_comments FOR DELETE USING (true);

-- RLS Policies for idea_attachments
CREATE POLICY "Anyone can view attachments" ON public.idea_attachments FOR SELECT USING (true);
CREATE POLICY "Anyone can create attachments" ON public.idea_attachments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete attachments" ON public.idea_attachments FOR DELETE USING (true);

-- RLS Policies for department_evaluation_criteria
CREATE POLICY "Anyone can view criteria" ON public.department_evaluation_criteria FOR SELECT USING (true);
CREATE POLICY "Anyone can manage criteria" ON public.department_evaluation_criteria FOR ALL USING (true);