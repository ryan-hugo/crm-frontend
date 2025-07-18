import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import type {
  Contact,
  ContactType,
  CreateContactRequest,
  UpdateContactRequest,
} from "@/types/contact";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    contactData: CreateContactRequest | UpdateContactRequest
  ) => Promise<void>;
  contact?: Contact; // For editing existing contacts
  title: string;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  contact,
  title,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [type, setType] = useState<string>("CLIENT");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form if editing existing contact
  useEffect(() => {
    if (contact) {
      setName(contact.name || "");
      setEmail(contact.email || "");
      setPhone(contact.phone || "");
      setCompany(contact.company || "");
      setPosition(contact.position || "");
      setType(contact.type || "CLIENT");
      setNotes(contact.notes || "");
    } else {
      // Reset form for new contact
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setPosition("");
      setType("CLIENT");
      setNotes("");
    }
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !type) {
      setError("Nome, e-mail e tipo são obrigatórios");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const contactData: CreateContactRequest | UpdateContactRequest = {
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        position: position || undefined,
        type: type as ContactType,
        notes: notes || undefined,
      };

      // Add required fields for updating
      if (contact) {
        (contactData as UpdateContactRequest).id = contact.id;
      }

      await onSubmit(contactData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar contato");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-16 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">
              Nome <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do contato"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">Telefone</Label>
            <Input
              id="contact-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-company">Empresa</Label>
            <Input
              id="contact-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Nome da empresa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-position">Cargo</Label>
            <Input
              id="contact-position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Cargo na empresa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-type">
              Tipo <span className="text-red-500">*</span>
            </Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLIENT">Cliente</SelectItem>
                <SelectItem value="LEAD">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-notes">Observações</Label>
            <Input
              id="contact-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre o contato"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : contact ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactFormModal;
