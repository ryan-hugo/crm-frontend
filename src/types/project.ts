export type ProjectStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Project {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: ProjectStatus;
  client_id?: number;
  client?: {
    id: number;
    name: string;
    email: string;
  };
  tasks_count?: number;
  completed_tasks?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  client_id?: number;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  id: number;
  status?: ProjectStatus;
}

