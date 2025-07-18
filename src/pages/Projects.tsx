import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Search,
  Briefcase,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
} from "lucide-react";
import { projectsService } from "../services/projects";
import { formatDate, formatProgress } from "../utils/formatters";
import { STATUS_COLORS } from "../utils/constants";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/project";
import ProjectFormModal from "../components/projects/ProjectFormModal";
import ContactFilter from "../components/common/ContactFilter";
import {
  PageHeaderSkeleton,
  FiltersSkeleton,
  CardListSkeleton,
} from "@/components/ui/skeleton";

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<
    number | undefined
  >();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined
  );

  useEffect(() => {
    loadProjects();
  }, [statusFilter, selectedContactId]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;
      if (selectedContactId) filters.client_id = selectedContactId;

      const data = await projectsService.getProjects(filters);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedProject(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(undefined);
  };

  const handleSubmitProject = async (
    projectData: CreateProjectRequest | UpdateProjectRequest
  ) => {
    try {
      setLoading(true);

      if ("id" in projectData) {
        // It's an update
        await projectsService.updateProject(projectData.id, projectData);
      } else {
        // It's a creation
        await projectsService.createProject(
          projectData as CreateProjectRequest
        );
      }

      loadProjects();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este projeto?")) {
      return;
    }

    try {
      setLoading(true);
      await projectsService.deleteProject(projectId);
      loadProjects();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Concluído";
      case "IN_PROGRESS":
        return "Em Andamento";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      project.name.toLowerCase().includes(searchLower) ||
      (project.description &&
        project.description.toLowerCase().includes(searchLower)) ||
      (project.client &&
        project.client.name.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <FiltersSkeleton />
        <CardListSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600">
            Gerencie seus projetos e acompanhe o progresso
          </p>
        </div>

        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
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
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <ContactFilter
                selectedContactId={selectedContactId}
                onContactChange={setSelectedContactId}
              />

              <Button
                variant={statusFilter === "" ? "default" : "outline"}
                onClick={() => setStatusFilter("")}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === "IN_PROGRESS" ? "default" : "outline"}
                onClick={() => setStatusFilter("IN_PROGRESS")}
                size="sm"
              >
                Em Andamento
              </Button>
              <Button
                variant={statusFilter === "COMPLETED" ? "default" : "outline"}
                onClick={() => setStatusFilter("COMPLETED")}
                size="sm"
              >
                Concluídos
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
            <Button onClick={loadProjects} className="mt-2">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter
                  ? "Tente ajustar os filtros de busca."
                  : "Comece criando seu primeiro projeto."}
              </p>
              <Button onClick={handleOpenCreateModal}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Projeto
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {project.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_COLORS[project.status]
                        }`}
                      >
                        {getStatusText(project.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {project.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {project.client && (
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <User className="h-4 w-4 mr-2" />
                    <span className="truncate">{project.client.name}</span>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {project.start_date && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Início: {formatDate(project.start_date)}</span>
                    </div>
                  )}

                  {project.end_date && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Fim: {formatDate(project.end_date)}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {project.tasks_count && project.tasks_count > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>
                        {formatProgress(
                          project.completed_tasks || 0,
                          project.tasks_count
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            ((project.completed_tasks || 0) /
                              project.tasks_count) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {project.completed_tasks || 0} de {project.tasks_count}{" "}
                      tarefas concluídas
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-3">
                    Criado em {formatDate(project.created_at)}
                  </p>

                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(project)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
        project={selectedProject}
        title={selectedProject ? "Editar Projeto" : "Novo Projeto"}
      />
    </div>
  );
};

export default Projects;
