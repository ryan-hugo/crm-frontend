import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  CheckSquare,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usersService } from "../services/users";
import { contactsService } from "../services/contacts";
import { tasksService } from "../services/tasks";
import { projectsService } from "../services/projects";
import { interactionsService } from "../services/interactions";
import { useAuth } from "../hooks/useAuth";
import type { UserStats, DashboardData } from "../types/api";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      let data: DashboardData;

      try {
        // Tentar buscar dados completos do dashboard primeiro
        data = await usersService.getDashboardData();
        console.log("Dashboard data received:", data);

        // Extrair stats dos dados do dashboard
        setStats(data.stats);
        setDashboardData(data);
      } catch (dashboardError) {
        console.warn(
          "Failed to get dashboard data, trying user stats:",
          dashboardError
        );

        try {
          // Fallback para o endpoint de stats
          const statsData = await usersService.getUserStats();
          console.log("Stats received from /users/stats:", statsData);

          setStats(statsData);
          setDashboardData({
            stats: statsData,
            recent_activities: [],
            recent_projects: [],
            recent_interactions: [],
            recent_pending_tasks: [],
            recent_contacts: [],
          });
        } catch (statsError) {
          console.warn(
            "Failed to get stats from /users/stats, fetching individually:",
            statsError
          );

          // Fallback final: buscar dados individuais
          const [contacts, tasks, projects, activeProjects, interactions] =
            await Promise.allSettled([
              contactsService.getContacts(),
              tasksService.getTasks({ status: "PENDING" }),
              projectsService.getProjects(),
              projectsService.getActiveProjects(),
              interactionsService.getInteractions(),
            ]);

          const contactsData =
            contacts.status === "fulfilled" ? contacts.value : [];
          const tasksResponse =
            tasks.status === "fulfilled"
              ? tasks.value
              : {
                  tasks: [],
                  total_tasks: 0,
                  pagination: {
                    current_page: 1,
                    total_pages: 1,
                    page_size: 10,
                    total_items: 0,
                    has_next: false,
                    has_prev: false,
                  },
                };
          const tasksData = tasksResponse.tasks || [];
          const projectsData =
            projects.status === "fulfilled" ? projects.value : [];
          const activeProjectsData =
            activeProjects.status === "fulfilled" ? activeProjects.value : [];
          const interactionsData =
            interactions.status === "fulfilled" ? interactions.value : [];

          // Use active projects count from dedicated endpoint if available, otherwise filter
          const activeProjectsCount =
            activeProjectsData.length > 0
              ? activeProjectsData.length
              : projectsData.filter((p: any) => p.status === "IN_PROGRESS")
                  .length;

          // Montar stats manualmente
          const calculatedStats: UserStats = {
            total_contacts: contactsData.length,
            total_clients: contactsData.filter((c: any) => c.type === "CLIENT")
              .length,
            total_leads: contactsData.filter((c: any) => c.type === "LEAD")
              .length,
            total_tasks: tasksData.length,
            pending_tasks: tasksData.filter((t: any) => t.status === "PENDING")
              .length,
            completed_tasks: tasksData.filter(
              (t: any) => t.status === "COMPLETED"
            ).length,
            overdue_tasks: tasksData.filter(
              (t: any) =>
                t.status === "PENDING" && new Date(t.due_date) < new Date()
            ).length,
            total_projects: projectsData.length,
            active_projects: activeProjectsCount,
            completed_projects: projectsData.filter(
              (p: any) => p.status === "COMPLETED"
            ).length,
            total_interactions: interactionsData.length,
            recent_interactions: interactionsData.filter((i: any) => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              const interactionDate = new Date(i.date);
              return interactionDate > weekAgo && interactionDate <= new Date();
            }).length,
          };

          setStats(calculatedStats);
          setDashboardData({
            stats: calculatedStats,
            recent_activities: [],
            recent_projects: [],
            recent_interactions: [],
            recent_pending_tasks: [],
            recent_contacts: [],
          });
        }
      }
    } catch (err: any) {
      console.error("Error loading dashboard data:", err);
      setError(err.message || "Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total de Contatos",
      value: stats?.total_contacts || 0,
      description: `${stats?.total_clients || 0} clientes, ${
        stats?.total_leads || 0
      } leads`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      link: "/contacts",
    },
    {
      title: "Total de Tarefas",
      value: stats?.total_tasks || 0,
      description: `${stats?.pending_tasks || 0} pendentes, ${
        stats?.completed_tasks || 0
      } concluídas`,
      icon: CheckSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      link: "/tasks",
    },
    {
      title: "Total de Projetos",
      value: stats?.total_projects || 0,
      description: `${stats?.active_projects || 0} ativos, ${
        stats?.completed_projects || 0
      } concluídos`,
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/projects",
    },
    {
      title: "Total de Interações",
      value: stats?.total_interactions || 0,
      description: `${stats?.recent_interactions || 0} nos últimos 7 dias`,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      link: "/interactions",
    },
  ];

  const quickActions = [
    {
      title: "Novo Contato",
      description: "Adicionar cliente ou lead",
      icon: Users,
      link: "/contacts",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Nova Tarefa",
      description: "Criar nova tarefa",
      icon: CheckSquare,
      link: "/tasks",
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      title: "Novo Projeto",
      description: "Iniciar novo projeto",
      icon: Briefcase,
      link: "/projects",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Nova Interação",
      description: "Registrar comunicação",
      icon: MessageSquare,
      link: "/interactions",
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Aqui está um resumo das suas atividades no CRM
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadStats}
                className="ml-auto"
              >
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades principais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.link}>
                  <Button
                    variant="outline"
                    className="h-24 w-full p-4 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-all duration-200"
                  >
                    <action.icon className="h-6 w-6 flex-shrink-0" />
                    <div className="text-center">
                      <div className="font-medium text-sm leading-tight">
                        {action.title}
                      </div>
                      <div className="text-xs text-gray-500 leading-tight">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Suas últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.recent_activities &&
              dashboardData.recent_activities.length > 0 ? (
                dashboardData.recent_activities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex-shrink-0">
                      {activity.type === "TASK" && (
                        <CheckSquare className="h-5 w-5 text-orange-600" />
                      )}
                      {activity.type === "PROJECT" && (
                        <Briefcase className="h-5 w-5 text-green-600" />
                      )}
                      {activity.type === "CONTACT" && (
                        <Users className="h-5 w-5 text-blue-600" />
                      )}
                      {activity.type === "INTERACTION" && (
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {activity.action}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {activity.detail}
                      </p>
                      {activity.related_name && (
                        <p className="text-xs text-gray-400">
                          Relacionado a: {activity.related_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(activity.created_at).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 text-center py-8">
                  Nenhuma atividade recente encontrada.
                  <br />
                  Comece criando contatos, tarefas ou projetos!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Insights */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Resumo Geral
            </CardTitle>
            <CardDescription>
              Visão geral da sua performance no CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.recent_interactions}
                </div>
                <div className="text-sm text-blue-700">Interações Recentes</div>
                <div className="text-xs text-blue-600 mt-1">
                  Últimos 7 dias de {stats.total_interactions} totais
                </div>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {(
                    (stats.completed_tasks / (stats.total_tasks || 1)) *
                    100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-sm text-orange-700">Taxa de Conclusão</div>
                <div className="text-xs text-orange-600 mt-1">
                  {stats.completed_tasks} de {stats.total_tasks} tarefas
                </div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {(
                    (stats.completed_projects / (stats.total_projects || 1)) *
                    100
                  ).toFixed(0)}
                  %
                </div>
                <div className="text-sm text-green-700">
                  Projetos Concluídos
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {stats.completed_projects} de {stats.total_projects} projetos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Indicators */}
      {stats && (stats.pending_tasks > 0 || stats.overdue_tasks > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <AlertCircle className="h-5 w-5 mr-2" />
              Atenção Necessária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.overdue_tasks > 0 && (
                <p className="text-yellow-700">
                  • Você tem {stats.overdue_tasks} tarefa(s) em atraso
                </p>
              )}
              {stats.pending_tasks > 0 && (
                <p className="text-yellow-700">
                  • Você tem {stats.pending_tasks} tarefa(s) pendente(s)
                </p>
              )}
              {stats.active_projects > 0 && (
                <p className="text-yellow-700">
                  • Você tem {stats.active_projects} projeto(s) em andamento
                </p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Link to="/tasks">
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                  Ver Tarefas
                </Button>
              </Link>
              {stats.active_projects > 0 && (
                <Link to="/projects">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-yellow-600 text-yellow-700 hover:bg-yellow-600 hover:text-white"
                  >
                    Ver Projetos
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
