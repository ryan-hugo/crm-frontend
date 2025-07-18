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
import { contactsService } from "../../services/contacts";
import { projectsService } from "../../services/projects";
import type {
  Task,
  TaskPriority,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "@/types/task";
import type { Contact } from "@/types/contact";
import type { Project } from "@/types/project";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  task?: Task; // For editing existing tasks
  title: string;
  contact?: Contact;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  title,
  contact,
}) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [contactId, setContactId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Data for dropdowns
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Load contacts and projects for dropdowns
  useEffect(() => {
    if (isOpen) {
      loadDropdownData();
    }
  }, [isOpen]);

  useEffect(() => {
    // Garante que contactId é atualizado após carregar contatos
    if (contact && isOpen) {
      setContactId(String(contact.id));
    }
  }, [contact, isOpen]);

  // Populate form if editing existing task
  useEffect(() => {
    if (task) {
      setTaskTitle(task.title || "");
      setDescription(task.description || "");
      setDueDate(task.due_date ? task.due_date.split("T")[0] : "");
      setPriority(task.priority || "MEDIUM");
      setContactId(task.contact_id ? String(task.contact_id) : "");
      setProjectId(task.project_id?.toString() || "");
    } else if (contact) {
      // Novo: sempre que abrir com contato, define o id
      setTaskTitle("");
      setDescription("");
      setDueDate("");
      setPriority("MEDIUM");
      setContactId(String(contact.id));
      setProjectId("");
    } else {
      // Reset form para nova tarefa sem contato
      setTaskTitle("");
      setDescription("");
      setDueDate("");
      setPriority("MEDIUM");
      setContactId("");
      setProjectId("");
    }
    setError("");
  }, [task, contact]);

  const loadDropdownData = async () => {
    try {
      setLoadingData(true);
      const [contactsData, projectsData] = await Promise.all([
        contactsService.getContacts(),
        projectsService.getProjects(),
      ]);
      setContacts(contactsData);
      setProjects(projectsData);
    } catch (err: any) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle) {
      setError("Título é obrigatório");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Parse and validate IDs
      const parsedContactId = contactId ? parseInt(contactId) : undefined;
      const parsedProjectId = projectId ? parseInt(projectId) : undefined;

      // Validate parsed IDs
      if (contactId && (isNaN(parsedContactId!) || parsedContactId! <= 0)) {
        setError("ID do contato inválido");
        return;
      }

      if (projectId && (isNaN(parsedProjectId!) || parsedProjectId! <= 0)) {
        setError("ID do projeto inválido");
        return;
      }

      const taskData: CreateTaskRequest | UpdateTaskRequest = {
        title: taskTitle,
        description: description || undefined,
        due_date: dueDate ? `${dueDate}T23:59:59.000Z` : undefined,
        priority: priority as TaskPriority,
        contact_id: parsedContactId,
        project_id: parsedProjectId,
      };

      // Remove undefined values to clean up the payload
      const cleanedTaskData = Object.fromEntries(
        Object.entries(taskData).filter(([_, value]) => value !== undefined)
      ) as CreateTaskRequest | UpdateTaskRequest;

      console.log("Task data being submitted:", cleanedTaskData);
      console.log("Form values:", {
        taskTitle,
        description,
        dueDate,
        priority,
        contactId,
        projectId,
      });

      // Add required fields for updating
      if (task) {
        (cleanedTaskData as UpdateTaskRequest).id = task.id;
      }

      await onSubmit(cleanedTaskData);
      onClose();
    } catch (err: any) {
      console.error("Task submission error:", err);
      setError(err.message || "Erro ao salvar tarefa");
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
            <Label htmlFor="task-title">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="task-title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Título da tarefa"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Descrição</Label>
            <Input
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição detalhada da tarefa"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-due-date">Data de Vencimento</Label>
            <Input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-priority">Prioridade</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Baixa</SelectItem>
                <SelectItem value="MEDIUM">Média</SelectItem>
                <SelectItem value="HIGH">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-contact">Contato</Label>
            <div className="flex gap-2">
              <Select
                value={contactId}
                onValueChange={setContactId}
                required
                disabled={!!contact}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um contato">
                    {(() => {
                      if (contactId) {
                        const found = contacts.find(
                          (c) => String(c.id) === String(contactId)
                        );
                        if (found) return found.name;
                        if (contact) return contact.name;
                      }
                      return undefined;
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {contactId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setContactId("")}
                  className="px-3"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-project">Projeto</Label>
            <div className="flex gap-2">
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {projectId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setProjectId("")}
                  className="px-3"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {loadingData && (
            <div className="text-sm text-gray-600">
              Carregando contatos e projetos...
            </div>
          )}

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
            <Button type="submit" disabled={loading || loadingData}>
              {loading ? "Salvando..." : task ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
