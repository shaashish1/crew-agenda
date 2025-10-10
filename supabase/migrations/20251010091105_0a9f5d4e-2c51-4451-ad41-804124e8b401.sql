-- Create project_phases table
CREATE TABLE IF NOT EXISTS public.project_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  phase_name TEXT NOT NULL,
  phase_number INTEGER NOT NULL,
  status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  target_end_date TIMESTAMP WITH TIME ZONE,
  gate_approved BOOLEAN DEFAULT false,
  gate_approval_date TIMESTAMP WITH TIME ZONE,
  gate_approved_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_project_phase UNIQUE(project_id, phase_number)
);

-- Enable RLS
ALTER TABLE public.project_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on project_phases" ON public.project_phases FOR ALL USING (true) WITH CHECK (true);

-- Create document_templates table
CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phase_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('strategic', 'contractual', 'technical', 'quality', 'governance', 'vendor')),
  is_critical_milestone BOOLEAN DEFAULT false,
  description TEXT,
  template_content TEXT,
  typical_owner TEXT,
  estimated_days INTEGER,
  dependencies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on document_templates" ON public.document_templates FOR ALL USING (true) WITH CHECK (true);

-- Create project_document_checklist table
CREATE TABLE IF NOT EXISTS public.project_document_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  phase_id UUID REFERENCES public.project_phases(id) ON DELETE CASCADE,
  document_template_id UUID REFERENCES public.document_templates(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  is_required BOOLEAN DEFAULT true,
  completion_status TEXT DEFAULT 'not-started' CHECK (completion_status IN ('not-started', 'in-progress', 'completed', 'not-applicable')),
  assigned_to TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_project_template UNIQUE(project_id, document_template_id)
);

-- Enable RLS
ALTER TABLE public.project_document_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on project_document_checklist" ON public.project_document_checklist FOR ALL USING (true) WITH CHECK (true);

-- Add new columns to existing documents table
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS phase_id UUID REFERENCES public.project_phases(id) ON DELETE SET NULL;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS document_template_id UUID REFERENCES public.document_templates(id) ON DELETE SET NULL;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS is_critical_milestone BOOLEAN DEFAULT false;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'draft' CHECK (approval_status IN ('draft', 'in-review', 'approved', 'rejected'));
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS approved_by TEXT;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS approved_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS document_category TEXT;

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_project_phases_updated_at ON public.project_phases;
CREATE TRIGGER update_project_phases_updated_at
  BEFORE UPDATE ON public.project_phases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_document_checklist_updated_at ON public.project_document_checklist;
CREATE TRIGGER update_project_document_checklist_updated_at
  BEFORE UPDATE ON public.project_document_checklist
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_phases_project_id ON public.project_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_document_templates_phase ON public.document_templates(phase_name);
CREATE INDEX IF NOT EXISTS idx_project_document_checklist_project ON public.project_document_checklist(project_id);
CREATE INDEX IF NOT EXISTS idx_project_document_checklist_phase ON public.project_document_checklist(phase_id);
CREATE INDEX IF NOT EXISTS idx_documents_phase ON public.documents(phase_id);