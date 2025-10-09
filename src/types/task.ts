export interface Task {
  id: string;
  serialNo: number;
  owner: string[];
  actionItem: string;
  reportedDate: string;
  targetDate: string;
  status: TaskStatus;
  progressComments: string;
  category?: string;
  priority_score?: number;
  sentiment?: string;
  dependencies?: string[];
  project_id?: string;
}

export type TaskStatus = string;

export interface Category {
  id: string;
  name: string;
}

export interface Owner {
  id: string;
  name: string;
  email?: string;
}
