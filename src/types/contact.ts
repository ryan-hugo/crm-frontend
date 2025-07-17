export type ContactType = 'CLIENT' | 'LEAD';

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  type: ContactType;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  type: ContactType;
  notes?: string;
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {
  id: number;
}

