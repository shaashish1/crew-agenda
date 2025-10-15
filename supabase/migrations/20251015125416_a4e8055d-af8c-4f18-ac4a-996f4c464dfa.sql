-- Create subtasks table
CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_task_id TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Not Started',
  owner TEXT[] DEFAULT '{}',
  target_date TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  order_index INTEGER NOT NULL DEFAULT 0,
  progress_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table for database persistence (currently using localStorage)
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT NOT NULL PRIMARY KEY,
  serial_no INTEGER NOT NULL,
  owner TEXT[] NOT NULL DEFAULT '{}',
  action_item TEXT NOT NULL,
  reported_date TIMESTAMP WITH TIME ZONE NOT NULL,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  progress_comments TEXT,
  category TEXT,
  priority_score NUMERIC,
  sentiment TEXT,
  dependencies TEXT[] DEFAULT '{}',
  project_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for subtasks
CREATE POLICY "Anyone can view subtasks" 
ON public.subtasks 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create subtasks" 
ON public.subtasks 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update subtasks" 
ON public.subtasks 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete subtasks" 
ON public.subtasks 
FOR DELETE 
USING (true);

-- Create policies for tasks
CREATE POLICY "Anyone can view tasks" 
ON public.tasks 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update tasks" 
ON public.tasks 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete tasks" 
ON public.tasks 
FOR DELETE 
USING (true);

-- Create trigger for subtasks updated_at
CREATE TRIGGER update_subtasks_updated_at
BEFORE UPDATE ON public.subtasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for tasks updated_at
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_subtasks_parent_task_id ON public.subtasks(parent_task_id);
CREATE INDEX idx_subtasks_order ON public.subtasks(parent_task_id, order_index);
CREATE INDEX idx_tasks_dependencies ON public.tasks USING GIN(dependencies);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);