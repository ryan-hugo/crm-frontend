import { apiGet, apiPost, apiPut, apiDelete } from './api';
import type { Interaction, CreateInteractionRequest, UpdateInteractionRequest } from '../types/interaction';
import type { PaginationParams, FilterParams } from '../types/api';

export const interactionsService = {
  /**
   * Obter lista de interações
   */
  async getInteractions(params?: PaginationParams & FilterParams): Promise<Interaction[]> {
    return await apiGet<Interaction[]>('/interactions/list', params);
  },

  /**
   * Obter interações por tipo
   */
  async getInteractionsByType(type: string, params?: PaginationParams & FilterParams): Promise<Interaction[]> {
    return await apiGet<Interaction[]>('/interactions', { ...params, type });
  },

  /**
   * Obter interação por ID
   */
  async getInteraction(id: number): Promise<Interaction> {
    return await apiGet<Interaction>(`/interactions/${id}`);
  },

  /**
   * Criar nova interação
   */
  async createInteraction(contactId: number, interactionData: Omit<CreateInteractionRequest, 'contact_id'>): Promise<Interaction> {
    return await apiPost<Interaction>(`/contacts/${contactId}/interactions`, interactionData);
  },

  /**
   * Atualizar interação
   */
  async updateInteraction(id: number, interactionData: Partial<UpdateInteractionRequest>): Promise<Interaction> {
    return await apiPut<Interaction>(`/interactions/${id}`, interactionData);
  },

  /**
   * Excluir interação
   */
  async deleteInteraction(id: number): Promise<void> {
    return await apiDelete<void>(`/interactions/${id}`);
  },

  /**
   * Obter interações de um contato específico
   */
  async getContactInteractions(contactId: number, params?: PaginationParams & FilterParams): Promise<Interaction[]> {
    return await apiGet<Interaction[]>(`/contacts/${contactId}/interactions`, params);
  },
};

