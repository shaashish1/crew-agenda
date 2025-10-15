-- Create milestones table
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  baseline_target_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'planned',
  order_index INTEGER NOT NULL DEFAULT 0,
  dependencies TEXT[] DEFAULT '{}',
  is_critical_path BOOLEAN DEFAULT false,
  approval_required BOOLEAN DEFAULT false,
  approved_by TEXT,
  approved_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT milestones_status_check CHECK (status IN ('planned', 'in-progress', 'completed', 'delayed', 'at-risk'))
);

-- Enable RLS
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view milestones"
  ON public.milestones
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create milestones"
  ON public.milestones
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update milestones"
  ON public.milestones
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete milestones"
  ON public.milestones
  FOR DELETE
  USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_milestones_project_id ON public.milestones(project_id);
CREATE INDEX idx_milestones_status ON public.milestones(status);
CREATE INDEX idx_milestones_target_date ON public.milestones(target_date);