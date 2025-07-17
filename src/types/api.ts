export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  search?: string;
  type?: string;
  status?: string;
  priority?: string;
}

export interface UserStats {
  total_contacts: number;
  total_clients: number;
  total_leads: number;
  pending_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  active_projects: number;
  total_interactions: number;
  recent_interactions: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

