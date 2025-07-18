import { apiGet, apiPut } from './api';
import type { User } from '../types/auth';
import type { UserStats, DashboardData } from '../types/api';

interface UpdateProfileRequest {
  name: string;
  email: string;
}

interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export const usersService = {
  /**
   * Obter perfil do usuário
   */
  async getProfile(): Promise<User> {
    return await apiGet<User>('/users/profile');
  },

  /**
   * Atualizar perfil do usuário
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<User> {
    return await apiPut<User>('/users/profile', profileData);
  },

  /**
   * Alterar senha do usuário
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    return await apiPut<void>('/users/change-password', passwordData);
  },

  /**
   * Obter estatísticas do usuário
   */
  async getUserStats(): Promise<UserStats> {
    return await apiGet<UserStats>('/users/stats');
  },

  /**
   * Obter dados completos do dashboard
   */
  async getDashboardData(): Promise<DashboardData> {
    return await apiGet<DashboardData>('/users/dashboard');
  },
};

