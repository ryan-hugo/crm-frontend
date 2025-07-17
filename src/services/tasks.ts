import { apiGet, apiPost, apiPut, apiDelete } from './api';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task';
import type { PaginationParams, FilterParams } from '../types/api';

export const tasksService = {
  /**
   * Obter lista de tarefas
   */
  async getTasks(params?: PaginationParams & FilterParams & { page?: number; page_size?: number }): Promise<{
    tasks: Task[];
    total_tasks: number;
    pagination: {
      current_page: number;
      total_pages: number;
      page_size: number;
      total_items: number;
      has_next: boolean;
      has_prev: boolean;
    };
  }> {
    console.log("getTasks called with params:", params);
    const response = await apiGet<{
      tasks: Task[];
      total_tasks: number;
      pagination: {
        current_page: number;
        total_pages: number;
        page_size: number;
        total_items: number;
        has_next: boolean;
        has_prev: boolean;
      };
    }>('/tasks/list', params);
    console.log("Raw API response in service:", response);
    console.log("Response type:", typeof response);
    console.log("Response keys:", Object.keys(response || {}));
    
    // Verificar se recebemos a estrutura esperada
    if (!response) {
      throw new Error("Resposta vazia da API");
    }
    
    // Se a resposta não tem a estrutura esperada, tentar adaptar
    if (!response.pagination && Array.isArray(response)) {
      console.warn("API retornou array direto, adaptando...");
      return {
        tasks: response as Task[],
        total_tasks: (response as Task[]).length,
        pagination: {
          current_page: 1,
          total_pages: 1,
          page_size: (response as Task[]).length,
          total_items: (response as Task[]).length,
          has_next: false,
          has_prev: false
        }
      };
    }
    
    return response;
  },

  /**
   * Obter tarefas pendentes
   */
  async getPendingTasks(params?: PaginationParams & FilterParams): Promise<Task[]> {
    return await apiGet<Task[]>('/tasks', { ...params, status: 'PENDING' });
  },

  /**
   * Obter tarefas concluídas
   */
  async getCompletedTasks(params?: PaginationParams & FilterParams): Promise<Task[]> {
    return await apiGet<Task[]>('/tasks', { ...params, status: 'COMPLETED' });
  },

  /**
   * Obter tarefas em atraso
   */
  async getOverdueTasks(params?: PaginationParams & FilterParams): Promise<Task[]> {
    return await apiGet<Task[]>('/tasks/overdue', params);
  },

  /**
   * Obter tarefa por ID
   */
  async getTask(id: number): Promise<Task> {
    return await apiGet<Task>(`/tasks/${id}`);
  },

  /**
   * Criar nova tarefa
   */
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    console.log("Creating task with data:", taskData);
    return await apiPost<Task>('/tasks/create', taskData);
  },

  /**
   * Atualizar tarefa
   */
  async updateTask(id: number, taskData: Partial<UpdateTaskRequest>): Promise<Task> {
    return await apiPut<Task>(`/tasks/${id}`, taskData);
  },

  /**
   * Marcar tarefa como concluída
   */
  async completeTask(id: number): Promise<Task> {
    return await apiPut<Task>(`/tasks/${id}/complete`);
  },

  /**
   * Marcar tarefa como pendente
   */
  async uncompleteTask(id: number): Promise<Task> {
    return await apiPut<Task>(`/tasks/${id}/uncomplete`);
  },

  /**
   * Excluir tarefa
   */
  async deleteTask(id: number): Promise<void> {
    return await apiDelete<void>(`/tasks/${id}`);
  },
};

