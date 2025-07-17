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
import { useAuth } from "../hooks/useAuth";
import type { UserStats } from "../types/api";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await usersService.getUserStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
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
      title: "Tarefas Pendentes",
      value: stats?.pending_tasks || 0,
      description: `${stats?.overdue_tasks || 0} em atraso`,
      icon: CheckSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      link: "/tasks",
    },
    {
      title: "Projetos Ativos",
      value: stats?.active_projects || 0,
      description: "Em andamento",
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-50",
      link: "/projects",
    },
    {
      title: "Interações Recentes",
      value: stats?.recent_interactions || 0,
      description: "Últimos 7 dias",
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
                <div className="text-2xl font-bold">{stat.value}</div>
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
              <div className="text-sm text-gray-500 text-center py-8">
                Nenhuma atividade recente encontrada.
                <br />
                Comece criando contatos, tarefas ou projetos!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
            </div>
            <div className="mt-4">
              <Link to="/tasks">
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                  Ver Tarefas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
