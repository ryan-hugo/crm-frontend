import { apiGet, apiPost, apiPut, apiDelete } from './api';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task';
import type { PaginationParams, FilterParams } from '../types/api';

export const tasksService = {
  /**
   * Obter lista de tarefas
   */
  async getTasks(params?: PaginationParams & FilterParams): Promise<Task[]> {
    return await apiGet<Task[]>('/tasks/list', params);
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

