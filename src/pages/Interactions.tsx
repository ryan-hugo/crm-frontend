import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Search,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  User,
  Trash2,
  Edit,
} from "lucide-react";
import { interactionsService } from "../services/interactions";
import { formatDateTime, truncateText } from "../utils/formatters";
import { INTERACTION_COLORS } from "../utils/constants";
import type {
  Interaction,
  CreateInteractionRequest,
  UpdateInteractionRequest,
} from "../types/interaction";
import InteractionFormModal from "../components/interactions/InteractionFormModal";
import {
  PageHeaderSkeleton,
  FiltersSkeleton,
  TableRowSkeleton,
} from "@/components/ui/skeleton";

const Interactions: React.FC = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<
    Interaction | undefined
  >(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadInteractions();
  }, [typeFilter]);

  const loadInteractions = async () => {
    try {
      setLoading(true);
      setError("");

      const filters: any = {};
      if (typeFilter) filters.type = typeFilter;

      const data = await interactionsService.getInteractions(filters);
      setInteractions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedInteraction(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (interaction: Interaction) => {
    setSelectedInteraction(interaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInteraction(undefined);
  };

  const handleSubmitInteraction = async (
    interactionData: CreateInteractionRequest | UpdateInteractionRequest
  ) => {
    try {
      setLoading(true);

      if ("id" in interactionData) {
        // It's an update
        await interactionsService.updateInteraction(
          interactionData.id,
          interactionData
        );
      } else {
        // It's a creation
        await interactionsService.createInteraction(
          interactionData.contact_id,
          {
            subject: interactionData.subject,
            notes: interactionData.notes,
            date: interactionData.date,
            type: interactionData.type,
          }
        );
      }

      loadInteractions();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInteraction = async (interactionId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta interação?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await interactionsService.deleteInteraction(interactionId);
      loadInteractions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EMAIL":
        return <Mail className="h-4 w-4" />;
      case "CALL":
        return <Phone className="h-4 w-4" />;
      case "MEETING":
        return <Calendar className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "EMAIL":
        return "E-mail";
      case "CALL":
        return "Ligação";
      case "MEETING":
        return "Reunião";
      case "OTHER":
        return "Outro";
      default:
        return type;
    }
  };

  const filteredInteractions = interactions.filter((interaction) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (interaction.subject &&
        interaction.subject.toLowerCase().includes(searchLower)) ||
      (interaction.notes &&
        interaction.notes.toLowerCase().includes(searchLower)) ||
      (interaction.contact &&
        interaction.contact.name.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <FiltersSkeleton />
        <TableRowSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interações</h1>
          <p className="text-gray-600">
            Registre e acompanhe todas as comunicações
          </p>
        </div>

        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Interação
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
                  placeholder="Buscar interações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={typeFilter === "" ? "default" : "outline"}
                onClick={() => setTypeFilter("")}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={typeFilter === "EMAIL" ? "default" : "outline"}
                onClick={() => setTypeFilter("EMAIL")}
                size="sm"
              >
                E-mail
              </Button>
              <Button
                variant={typeFilter === "CALL" ? "default" : "outline"}
                onClick={() => setTypeFilter("CALL")}
                size="sm"
              >
                Ligação
              </Button>
              <Button
                variant={typeFilter === "MEETING" ? "default" : "outline"}
                onClick={() => setTypeFilter("MEETING")}
                size="sm"
              >
                Reunião
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
            <Button onClick={loadInteractions} className="mt-2">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : filteredInteractions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma interação encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || typeFilter
                  ? "Tente ajustar os filtros de busca."
                  : "Comece registrando sua primeira interação."}
              </p>
              <Button onClick={handleOpenCreateModal}>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Interação
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInteractions.map((interaction) => (
            <Card
              key={interaction.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-md ${INTERACTION_COLORS[
                        interaction.type
                      ]
                        ?.replace("text-", "bg-")
                        .replace("-800", "-100")}`}
                    >
                      {getTypeIcon(interaction.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">
                          {interaction.subject || "Sem assunto"}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            INTERACTION_COLORS[interaction.type]
                          }`}
                        >
                          {getTypeText(interaction.type)}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 space-x-4 mb-3">
                        {interaction.contact && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{interaction.contact.name}</span>
                          </div>
                        )}

                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDateTime(interaction.date)}</span>
                        </div>
                      </div>

                      {interaction.notes && (
                        <div className="bg-gray-50 rounded-md p-3 mb-3">
                          <p className="text-sm text-gray-700">
                            {truncateText(interaction.notes, 200)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditModal(interaction)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteInteraction(interaction.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  <p className="text-xs text-gray-500">
                    Criado em {formatDateTime(interaction.created_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Interaction Form Modal */}
      <InteractionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitInteraction}
        interaction={selectedInteraction}
        title={selectedInteraction ? "Editar Interação" : "Nova Interação"}
      />
    </div>
  );
};

export default Interactions;
