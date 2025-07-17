import { apiGet, apiPost, apiPut, apiDelete } from './api';
import type { Contact, CreateContactRequest, UpdateContactRequest } from '../types/contact';
import type { PaginationParams, FilterParams } from '../types/api';

export const contactsService = {
  /**
   * Obter lista de contatos
   */
  async getContacts(params?: PaginationParams & FilterParams): Promise<Contact[]> {
    return await apiGet<Contact[]>('/contacts/list', params);
  },

  /**
   * Obter apenas clientes
   */
  async getClients(params?: PaginationParams & FilterParams): Promise<Contact[]> {
    return await apiGet<Contact[]>('/contacts', { ...params, type: 'CLIENT' });
  },

  /**
   * Obter apenas leads
   */
  async getLeads(params?: PaginationParams & FilterParams): Promise<Contact[]> {
    return await apiGet<Contact[]>('/contacts', { ...params, type: 'LEAD' });
  },

  /**
   * Obter contato por ID
   */
  async getContact(id: number): Promise<Contact> {
    return await apiGet<Contact>(`/contacts/${id}`);
  },

  /**
   * Criar novo contato
   */
  async createContact(contactData: CreateContactRequest): Promise<Contact> {
    return await apiPost<Contact>('/contacts/create', contactData);
  },

  /**
   * Atualizar contato
   */
  async updateContact(id: number, contactData: Partial<UpdateContactRequest>): Promise<Contact> {
    return await apiPut<Contact>(`/contacts/${id}`, contactData);
  },

  /**
   * Excluir contato
   */
  async deleteContact(id: number): Promise<void> {
    return await apiDelete<void>(`/contacts/${id}`);
  },

  /**
   * Converter lead em cliente
   */
  async convertToClient(id: number): Promise<Contact> {
    return await apiPut<Contact>(`/contacts/${id}/convert-to-client`);
  },
};

