-- Create ai_predictions table for storing AI-generated predictions
CREATE TABLE IF NOT EXISTS public.ai_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  prediction_type TEXT NOT NULL,
  prediction_data JSONB NOT NULL,
  confidence_score DECIMAL(5,2),
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  model_version TEXT,
  metadata JSONB
);

-- Create ai_insights table for storing executive-level insights
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT,
  affected_projects TEXT[],
  action_items TEXT[],
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'new'
);

-- Create project_metrics_history table for tracking historical metrics
CREATE TABLE IF NOT EXISTS public.project_metrics_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  snapshot_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delay_percentage DECIMAL(5,2),
  budget_variance DECIMAL(10,2),
  resource_utilization DECIMAL(5,2),
  completed_milestones INTEGER,
  total_milestones INTEGER,
  open_risks INTEGER,
  critical_risks INTEGER,
  performance_rating TEXT,
  rag_status TEXT
);

-- Enable Row Level Security
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_metrics_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ai_predictions
CREATE POLICY "Users can view all predictions" ON public.ai_predictions FOR SELECT USING (true);
CREATE POLICY "Service role can manage predictions" ON public.ai_predictions FOR ALL USING (true);

-- Create RLS policies for ai_insights
CREATE POLICY "Users can view all insights" ON public.ai_insights FOR SELECT USING (true);
CREATE POLICY "Users can update insights" ON public.ai_insights FOR UPDATE USING (true);
CREATE POLICY "Service role can manage insights" ON public.ai_insights FOR ALL USING (true);

-- Create RLS policies for project_metrics_history
CREATE POLICY "Users can view all metrics history" ON public.project_metrics_history FOR SELECT USING (true);
CREATE POLICY "Service role can manage metrics history" ON public.project_metrics_history FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_predictions_project_id ON public.ai_predictions(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_type ON public.ai_predictions(prediction_type);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_generated_at ON public.ai_predictions(generated_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON public.ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_severity ON public.ai_insights(severity);
CREATE INDEX IF NOT EXISTS idx_ai_insights_status ON public.ai_insights(status);
CREATE INDEX IF NOT EXISTS idx_ai_insights_generated_at ON public.ai_insights(generated_at DESC);

CREATE INDEX IF NOT EXISTS idx_metrics_history_project_id ON public.project_metrics_history(project_id);
CREATE INDEX IF NOT EXISTS idx_metrics_history_snapshot_date ON public.project_metrics_history(snapshot_date DESC);