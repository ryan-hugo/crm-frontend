import { apiGet, apiPost, apiPut, apiDelete } from './api';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/project';
import type { PaginationParams, FilterParams } from '../types/api';

export const projectsService = {
  /**
   * Obter lista de projetos
   */
  async getProjects(params?: PaginationParams & FilterParams): Promise<Project[]> {
    return await apiGet<Project[]>('/projects/list', params);
  },

  /**
   * Obter projetos ativos
   */
  async getActiveProjects(params?: PaginationParams & FilterParams): Promise<Project[]> {
    return await apiGet<Project[]>('/projects', { ...params, status: 'IN_PROGRESS' });
  },

  /**
   * Obter projetos concluídos
   */
  async getCompletedProjects(params?: PaginationParams & FilterParams): Promise<Project[]> {
    return await apiGet<Project[]>('/projects', { ...params, status: 'COMPLETED' });
  },

  /**
   * Obter projeto por ID
   */
  async getProject(id: number): Promise<Project> {
    return await apiGet<Project>(`/projects/${id}`);
  },

  /**
   * Criar novo projeto
   */
  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    return await apiPost<Project>('/projects/create', projectData);
  },

  /**
   * Atualizar projeto
   */
  async updateProject(id: number, projectData: Partial<UpdateProjectRequest>): Promise<Project> {
    return await apiPut<Project>(`/projects/${id}`, projectData);
  },

  /**
   * Excluir projeto
   */
  async deleteProject(id: number): Promise<void> {
    return await apiDelete<void>(`/projects/${id}`);
  },
};

