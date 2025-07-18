import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Mail,
  Phone,
  Building,
  User,
  MessageSquare,
  Briefcase,
  CheckSquare,
  Edit,
  ExternalLink,
} from "lucide-react";
import { formatDate, formatPhone } from "../../utils/formatters";
import { interactionsService } from "../../services/interactions";
import { projectsService } from "../../services/projects";
import { tasksService } from "../../services/tasks";
import type { Contact } from "../../types/contact";
import type { Interaction } from "../../types/interaction";
import type { Task } from "../../types/task";

interface ContactDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null | undefined;
  onEdit: (contact: Contact) => void;
}

interface ContactStats {
  totalInteractions: number;
  lastInteraction?: Interaction;
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
}

const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({
  isOpen,
  onClose,
  contact,
  onEdit,
}) => {
  const [stats, setStats] = useState<ContactStats>({
    totalInteractions: 0,
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact && isOpen) {
      loadContactStats();
    }
  }, [contact, isOpen]);

  const loadContactStats = async () => {
    if (!contact) return;

    try {
      setLoading(true);

      // Buscar interações
      const interactions = await interactionsService.getInteractions({
        contact_id: contact.id,
      });
      const interactionsArray = Array.isArray(interactions) ? interactions : [];

      // Buscar projetos
      const projects = await projectsService.getProjects({
        client_id: contact.id,
      });
      const projectsArray = Array.isArray(projects) ? projects : [];

      // Buscar tarefas
      const tasksResponse = await tasksService.getTasks({
        contact_id: contact.id,
      });
      const tasksArray = Array.isArray(tasksResponse)
        ? tasksResponse
        : tasksResponse.tasks || [];

      const completedTasks = tasksArray.filter(
        (task: Task) => task.status === "COMPLETED"
      ).length;

      // Última interação
      const lastInteraction =
        interactionsArray.length > 0
          ? interactionsArray.sort(
              (a: Interaction, b: Interaction) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0]
          : undefined;

      setStats({
        totalInteractions: interactionsArray.length,
        lastInteraction,
        totalProjects: projectsArray.length,
        totalTasks: tasksArray.length,
        completedTasks,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas do contato:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = () => {
    if (contact?.email) {
      window.open(`mailto:${contact.email}`, "_blank");
    }
  };

  const handlePhoneClick = () => {
    if (contact?.phone) {
      window.open(`tel:${contact.phone}`, "_blank");
    }
  };

  if (!contact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes do Contato
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Coluna 1: Informações Básicas */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{contact.name}</h3>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                      contact.type === "CLIENT"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {contact.type === "CLIENT" ? "Cliente" : "Lead"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <button
                      onClick={handleEmailClick}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {contact.email}
                    </button>
                  </div>

                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <button
                        onClick={handlePhoneClick}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {formatPhone(contact.phone)}
                      </button>
                    </div>
                  )}

                  {contact.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{contact.company}</span>
                    </div>
                  )}

                  {contact.position && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{contact.position}</span>
                    </div>
                  )}
                </div>

                {contact.notes && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Observações:
                    </h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {contact.notes}
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t text-xs text-gray-500">
                  <p>Criado em {formatDate(contact.created_at)}</p>
                  <p>Atualizado em {formatDate(contact.updated_at)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2: Estatísticas e Atividades */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                    <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                    <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Interações</span>
                      </div>
                      <span className="font-semibold">
                        {stats.totalInteractions}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Projetos</span>
                      </div>
                      <span className="font-semibold">
                        {stats.totalProjects}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Tarefas</span>
                      </div>
                      <span className="font-semibold">
                        {stats.completedTasks}/{stats.totalTasks}
                      </span>
                    </div>

                    {stats.lastInteraction && (
                      <div className="pt-3 border-t">
                        <h4 className="font-medium text-sm text-gray-700 mb-2">
                          Última Interação:
                        </h4>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm font-medium">
                            {stats.lastInteraction.subject}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(stats.lastInteraction.date)} •{" "}
                            {stats.lastInteraction.type === "EMAIL"
                              ? "E-mail"
                              : stats.lastInteraction.type === "CALL"
                              ? "Ligação"
                              : stats.lastInteraction.type === "MEETING"
                              ? "Reunião"
                              : "Outro"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna 3: Ações Rápidas */}
          <div className="md:col-span-2 xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleEmailClick}
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar E-mail
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>

                {contact.phone && (
                  <Button
                    onClick={handlePhoneClick}
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Button>
                )}

                <div className="pt-3 border-t">
                  <Button
                    onClick={() => onEdit(contact)}
                    className="w-full"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Contato
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetailsModal;
