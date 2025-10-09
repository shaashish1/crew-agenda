// Temporary type definitions for new database tables
// These will be replaced by auto-generated Supabase types

export interface Idea {
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
