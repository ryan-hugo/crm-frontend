export type TaskStatus = 'PENDING' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  priority: TaskPriority;
  status: TaskStatus;
  contact_id?: number;
  project_id?: number;
  contact?: {
    id: number;
    name: string;
    email: string;
  };
  project?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  due_date?: string;
  priority: TaskPriority;
  contact_id?: number;
  project_id?: number;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  id: number;
  status?: TaskStatus;
}

