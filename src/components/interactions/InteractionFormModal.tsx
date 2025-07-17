import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { contactsService } from '@/services/contacts';
import type { Contact } from '@/types/contact';
import type { Interaction, CreateInteractionRequest, UpdateInteractionRequest, InteractionType } from '@/types/interaction';

interface InteractionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (interactionData: CreateInteractionRequest | UpdateInteractionRequest) => Promise<void>;
  interaction?: Interaction; // For editing existing interactions
  title: string;
}

const InteractionFormModal: React.FC<InteractionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  interaction,
  title
}) => {
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<string>('EMAIL');
  const [contactId, setContactId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Load contacts for the dropdown
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await contactsService.getContacts();
        setContacts(data);
      } catch (err) {
        console.error('Failed to load contacts', err);
      }
    };
    
    loadContacts();
  }, []);

  // Populate form if editing existing interaction
  useEffect(() => {
    if (interaction) {
      setSubject(interaction.subject || '');
      setNotes(interaction.notes || '');
      setDate(interaction.date || '');
      setType(interaction.type || 'EMAIL');
      setContactId(interaction.contact_id ? String(interaction.contact_id) : '');
    } else {
      // Reset form for new interaction
      const today = new Date().toISOString().split('T')[0];
      setSubject('');
      setNotes('');
      setDate(today);
      setType('EMAIL');
      setContactId('');
    }
  }, [interaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactId) {
      setError('Contato é obrigatório');
      return;
    }

    if (!type) {
      setError('Tipo é obrigatório');
      return;
    }

    if (!date) {
      setError('Data é obrigatória');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const interactionData: CreateInteractionRequest | UpdateInteractionRequest = {
        subject: subject || undefined,
        notes: notes || undefined,
        date,
        type: type as InteractionType,
        contact_id: parseInt(contactId, 10)
      };
      
      // Add required fields for updating
      if (interaction) {
        (interactionData as UpdateInteractionRequest).id = interaction.id;
      }
      
      await onSubmit(interactionData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar interação');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interaction-contact">Contato <span className="text-red-500">*</span></Label>
            <Select value={contactId} onValueChange={setContactId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um contato" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id.toString()}>
                    {contact.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interaction-type">Tipo <span className="text-red-500">*</span></Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EMAIL">E-mail</SelectItem>
                <SelectItem value="CALL">Ligação</SelectItem>
                <SelectItem value="MEETING">Reunião</SelectItem>
                <SelectItem value="OTHER">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interaction-subject">Assunto</Label>
            <Input
              id="interaction-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto da interação"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interaction-date">Data <span className="text-red-500">*</span></Label>
            <Input
              id="interaction-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interaction-notes">Notas</Label>
            <Input
              id="interaction-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas sobre a interação"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : interaction ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InteractionFormModal;
