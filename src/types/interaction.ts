export type InteractionType = 'EMAIL' | 'CALL' | 'MEETING' | 'OTHER';

export interface Interaction {
  id: number;
  subject?: string;
  notes?: string;
  date: string;
  type: InteractionType;
  contact_id: number;
  contact?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateInteractionRequest {
  subject?: string;
  notes?: string;
  date: string;
  type: InteractionType;
  contact_id: number;
}

export interface UpdateInteractionRequest extends Partial<CreateInteractionRequest> {
  id: number;
}

