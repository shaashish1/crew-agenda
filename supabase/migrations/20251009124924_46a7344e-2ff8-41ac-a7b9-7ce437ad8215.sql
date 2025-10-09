-- Create ideas table
CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_blueprints table
CREATE TABLE IF NOT EXISTS public.project_blueprints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  purpose TEXT NOT NULL,
  validation_criteria TEXT[] NOT NULL DEFAULT '{}',
  success_metrics TEXT[] NOT NULL DEFAULT '{}',
  assumptions TEXT[] NOT NULL DEFAULT '{}',
  constraints TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  phase TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  version TEXT NOT NULL DEFAULT '1.0',
  url TEXT,
  content TEXT,
  editor_state JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your auth requirements)
CREATE POLICY "Anyone can view ideas" ON public.ideas FOR SELECT USING (true);
CREATE POLICY "Anyone can create ideas" ON public.ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update ideas" ON public.ideas FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete ideas" ON public.ideas FOR DELETE USING (true);

CREATE POLICY "Anyone can view blueprints" ON public.project_blueprints FOR SELECT USING (true);
CREATE POLICY "Anyone can create blueprints" ON public.project_blueprints FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update blueprints" ON public.project_blueprints FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete blueprints" ON public.project_blueprints FOR DELETE USING (true);

CREATE POLICY "Anyone can view documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Anyone can create documents" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update documents" ON public.documents FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete documents" ON public.documents FOR DELETE USING (true);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON public.ideas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blueprints_updated_at BEFORE UPDATE ON public.project_blueprints
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();