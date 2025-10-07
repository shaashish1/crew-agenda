export interface Task {
  id: string;
  serialNo: number;
  owner: string;
  actionItem: string;
  reportedDate: string;
  targetDate: string;
  status: TaskStatus;
  progressComments: string;
  category?: string;
}

export type TaskStatus = 
  | "Not Started" 
  | "In Progress" 
  | "Completed" 
  | "On Hold" 
  | "Overdue";

export interface Category {
  id: string;
  name: string;
}

export interface Owner {
  id: string;
  name: string;
  email?: string;
}
