import { apiPost, apiGet, setAuthToken, removeAuthToken } from './api';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '../types/auth';

export const authService = {
  /**
   * Fazer login do usuário
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiPost<LoginResponse>('/auth/login', credentials);
    
    // Salvar token no localStorage
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  /**
   * Registrar novo usuário
   */
  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await apiPost<LoginResponse>('/auth/register', userData);
    
    // Salvar token no localStorage
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  /**
   * Validar token atual
   */
  async validateToken(): Promise<User> {
    return await apiGet<User>('/auth/validate');
  },

  /**
   * Fazer logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await apiPost('/auth/logout');
    } catch (error) {
      // Mesmo se der erro no servidor, remover token local
      console.warn('Erro ao fazer logout no servidor:', error);
    } finally {
      removeAuthToken();
    }
  },

  /**
   * Verificar se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('cliq_crm_token');
    return !!token;
  },

  /**
   * Obter dados do usuário do localStorage
   */
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('cliq_crm_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  /**
   * Salvar dados do usuário no localStorage
   */
  saveUser(user: User): void {
    localStorage.setItem('cliq_crm_user', JSON.stringify(user));
  },
};

