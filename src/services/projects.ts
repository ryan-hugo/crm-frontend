import { apiGet, apiPost, apiPut, apiDelete } from './api';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/project';
import type { PaginationParams, FilterParams } from '../types/api';

export const projectsService = {
  /**
   * Obter lista de projetos
   */
  async getProjects(params?: PaginationParams & FilterParams): Promise<Project[]> {
    console.log("Fetching projects with params:", params);
    const result = await apiGet<Project[]>('/projects/list', params);
    console.log("Projects received:", result);
    return result;
  },

  /**
   * Obter projetos ativos
   */
  async getActiveProjects(params?: PaginationParams & FilterParams): Promise<Project[]> {
    console.log("Fetching active projects with params:", params);
    const result = await apiGet<Project[]>('/projects/list/', { ...params, status: 'IN_PROGRESS' });
    console.log("Active projects received:", result);
    return result;
  },

  /**
   * Obter projetos concluídos
   */
  async getCompletedProjects(params?: PaginationParams & FilterParams): Promise<Project[]> {
    return await apiGet<Project[]>('/projects/list', { ...params, status: 'COMPLETED' });
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
    console.log("Creating project with data:", projectData);
    const result = await apiPost<Project>('/projects/create', projectData);
    console.log("Project created:", result);
    return result;
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

