import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, X } from "lucide-react";
import { contactsService } from "../../services/contacts";
import type { Contact } from "../../types/contact";

interface ContactFilterProps {
  selectedContactId?: number;
  onContactChange: (contactId?: number) => void;
  placeholder?: string;
  className?: string;
}

const ContactFilter: React.FC<ContactFilterProps> = ({
  selectedContactId,
  onContactChange,
  placeholder = "Filtrar por contato",
  className = "",
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadContacts();
  }, [search]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const data = await contactsService.getContacts(params);
      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading contacts:", error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Select
        value={selectedContactId?.toString() || ""}
        onValueChange={(value) =>
          onContactChange(value ? Number(value) : undefined)
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={placeholder}>
            {selectedContact ? (
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="truncate">{selectedContact.name}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500">
                <Users className="h-4 w-4" />
                <span>{placeholder}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <div className="p-2">
            <Input
              placeholder="Buscar contato..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
          </div>
          {loading ? (
            <SelectItem value="loading" disabled>
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Carregando...</span>
              </div>
            </SelectItem>
          ) : (
            <>
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-xs text-gray-500">
                          {contact.email}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-results" disabled>
                  Nenhum contato encontrado
                </SelectItem>
              )}
            </>
          )}
        </SelectContent>
      </Select>

      {selectedContactId && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onContactChange(undefined)}
          className="px-2"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ContactFilter;
