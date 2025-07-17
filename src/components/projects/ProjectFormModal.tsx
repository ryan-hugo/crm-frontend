import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { contactsService } from "../../services/contacts";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../types/project";
import type { Contact } from "../../types/contact";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateProjectRequest | UpdateProjectRequest
  ) => Promise<void>;
  project?: Project;
  title: string;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  title,
}) => {
  const [formData, setFormData] = useState<
    CreateProjectRequest | UpdateProjectRequest
  >({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    client_id: undefined,
  });
  const [clients, setClients] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadClients();
      if (project) {
        setFormData({
          id: project.id,
          name: project.name,
          description: project.description || "",
          start_date: project.start_date
            ? project.start_date.split("T")[0]
            : "",
          end_date: project.end_date ? project.end_date.split("T")[0] : "",
          client_id: project.client_id,
          status: project.status,
        });
      } else {
        setFormData({
          name: "",
          description: "",
          start_date: "",
          end_date: "",
          client_id: undefined,
        });
      }
    }
  }, [isOpen, project]);

  const loadClients = async () => {
    try {
      const data = await contactsService.getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Erro ao carregar clientes:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        value === "" ? undefined : name === "client_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Format dates properly before submitting
      const formattedData = { ...formData };

      // If there are dates, append time component to make them valid RFC3339 format
      if (formattedData.start_date) {
        formattedData.start_date = `${formattedData.start_date}T00:00:00Z`;
      }

      if (formattedData.end_date) {
        formattedData.end_date = `${formattedData.end_date}T00:00:00Z`;
      }

      await onSubmit(formattedData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao salvar o projeto.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Projeto *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nome do projeto"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Descrição do projeto"
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Data de Início</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="end_date">Data de Término</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="client_id">Cliente</Label>
                <select
                  id="client_id"
                  name="client_id"
                  value={formData.client_id || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              {project && (
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={
                      (formData as UpdateProjectRequest).status || "IN_PROGRESS"
                    }
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="IN_PROGRESS">Em Andamento</option>
                    <option value="COMPLETED">Concluído</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : project ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ProjectFormModal;
