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
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_interactions: number;
  recent_interactions: number;
}

export interface RecentActivity {
  id: number;
  type: 'TASK' | 'PROJECT' | 'CONTACT' | 'INTERACTION';
  action: 'CREATED' | 'UPDATED' | 'COMPLETED' | 'DELETED';
  title: string;
  detail: string;
  item_id: number;
  created_at: string;
  updated_at: string;
  related_id?: number;
  related_name?: string;
}

export interface DashboardData {
  stats: UserStats;
  recent_activities: RecentActivity[];
  recent_projects: any[];
  recent_interactions: any[];
  recent_pending_tasks: any[];
  recent_contacts: any[];
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

