import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Users, Mail, Phone, Building, Edit, Trash2 } from 'lucide-react';
import { contactsService } from '../services/contacts';
import { formatDate, formatPhone, getInitials } from '../utils/formatters';
import { STATUS_COLORS } from '../utils/constants';
import type { Contact, CreateContactRequest, UpdateContactRequest } from '../types/contact';
import ContactFormModal from '../components/contacts/ContactFormModal';

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [typeFilter]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filters: any = {};
      if (typeFilter) filters.type = typeFilter;
      
      const data = await contactsService.getContacts(filters);
      setContacts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenCreateModal = () => {
    setSelectedContact(undefined);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(undefined);
  };
  
  const handleSubmitContact = async (contactData: CreateContactRequest | UpdateContactRequest) => {
    try {
      setLoading(true);
      
      if ('id' in contactData) {
        // It's an update
        await contactsService.updateContact(contactData.id, contactData);
      } else {
        // It's a creation
        await contactsService.createContact(contactData as CreateContactRequest);
      }
      
      loadContacts();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteContact = async (contactId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este contato?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await contactsService.deleteContact(contactId);
      loadContacts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };
  


  const filteredContacts = contacts.filter(contact => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      (contact.company && contact.company.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Carregando contatos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contatos</h1>
          <p className="text-gray-600">Gerencie seus clientes e leads</p>
        </div>
        
        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Contato
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar contatos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={typeFilter === '' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={typeFilter === 'CLIENT' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('CLIENT')}
                size="sm"
              >
                Clientes
              </Button>
              <Button
                variant={typeFilter === 'LEAD' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('LEAD')}
                size="sm"
              >
                Leads
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
            <Button onClick={loadContacts} className="mt-2">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : filteredContacts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum contato encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || typeFilter ? 
                  "Tente ajustar os filtros de busca." : 
                  "Comece adicionando seu primeiro contato."
                }
              </p>
              <Button onClick={handleOpenCreateModal}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Contato
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-medium">
                      {getInitials(contact.name)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{contact.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[contact.type]}`}>
                        {contact.type === 'CLIENT' ? 'Cliente' : 'Lead'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  
                  {contact.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{formatPhone(contact.phone)}</span>
                    </div>
                  )}
                  
                  {contact.company && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      <span className="truncate">{contact.company}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Criado em {formatDate(contact.created_at)}
                  </p>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleOpenEditModal(contact)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitContact}
        contact={selectedContact}
        title={selectedContact ? "Editar Contato" : "Novo Contato"}
      />
    </div>
  );
};

export default Contacts;

