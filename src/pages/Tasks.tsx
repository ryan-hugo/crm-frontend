import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Search,
  CheckSquare,
  Calendar,
  User,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { tasksService } from "../services/tasks";
import { formatDate, isOverdue } from "../utils/formatters";
import { PRIORITY_COLORS } from "../utils/constants";
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "../types/task";
import TaskFormModal from "@/components/tasks/TaskFormModal";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    loadTasks();
  }, [statusFilter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;

      const data = await tasksService.getTasks(filters);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      const updatedTask =
        task.status === "PENDING"
          ? await tasksService.completeTask(task.id)
          : await tasksService.uncompleteTask(task.id);

      setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (err: any) {
      console.error("Erro ao atualizar tarefa:", err);
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedTask(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(undefined);
  };

  const handleSubmitTask = async (
    taskData: CreateTaskRequest | UpdateTaskRequest
  ) => {
    try {
      setLoading(true);

      if ("id" in taskData) {
        // It's an update
        await tasksService.updateTask(taskData.id, taskData);
      } else {
        // It's a creation
        await tasksService.createTask(taskData as CreateTaskRequest);
      }

      loadTasks();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      return;
    }

    try {
      setLoading(true);
      await tasksService.deleteTask(taskId);
      loadTasks();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "Alta";
      case "MEDIUM":
        return "Média";
      case "LOW":
        return "Baixa";
      default:
        return priority;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchLower) ||
      (task.description &&
        task.description.toLowerCase().includes(searchLower)) ||
      (task.contact && task.contact.name.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-600">Organize e acompanhe suas atividades</p>
        </div>

        <Button onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
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
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={statusFilter === "" ? "default" : "outline"}
                onClick={() => setStatusFilter("")}
                size="sm"
              >
                Todas
              </Button>
              <Button
                variant={statusFilter === "PENDING" ? "default" : "outline"}
                onClick={() => setStatusFilter("PENDING")}
                size="sm"
              >
                Pendentes
              </Button>
              <Button
                variant={statusFilter === "COMPLETED" ? "default" : "outline"}
                onClick={() => setStatusFilter("COMPLETED")}
                size="sm"
              >
                Concluídas
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
            <Button onClick={loadTasks} className="mt-2">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma tarefa encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter
                  ? "Tente ajustar os filtros de busca."
                  : "Comece criando sua primeira tarefa."}
              </p>
              <Button onClick={handleOpenCreateModal}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Tarefa
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`hover:shadow-md transition-shadow ${
                task.status === "COMPLETED" ? "opacity-75" : ""
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <button
                      onClick={() => handleToggleTask(task)}
                      className={`mt-1 flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                        task.status === "COMPLETED"
                          ? "bg-green-600 border-green-600 text-white"
                          : "border-gray-300 hover:border-green-600"
                      }`}
                    >
                      {task.status === "COMPLETED" && (
                        <CheckSquare className="h-3 w-3" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3
                          className={`font-medium ${
                            task.status === "COMPLETED"
                              ? "line-through text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </h3>

                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            PRIORITY_COLORS[task.priority]
                          }`}
                        >
                          {getPriorityText(task.priority)}
                        </span>

                        {task.due_date &&
                          isOverdue(task.due_date) &&
                          task.status === "PENDING" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Atrasada
                            </span>
                          )}
                      </div>

                      {task.description && (
                        <p
                          className={`text-sm mb-3 ${
                            task.status === "COMPLETED"
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {task.due_date && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(task.due_date)}</span>
                          </div>
                        )}

                        {task.contact && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{task.contact.name}</span>
                          </div>
                        )}

                        {task.project && (
                          <div className="flex items-center">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {task.project.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditModal(task)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
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

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        task={selectedTask}
        title={selectedTask ? "Editar Tarefa" : "Nova Tarefa"}
      />
    </div>
  );
};

export default Tasks;
