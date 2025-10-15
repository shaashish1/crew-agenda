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
  created_at?: string;
  updated_at?: string;
}
