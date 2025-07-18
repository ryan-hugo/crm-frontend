import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usersService } from "../services/users";
import type { UserStats } from "../types/api";

export interface Notification {
  id: string;
  type: "warning" | "info" | "error" | "success";
  title: string;
  message: string;
  action?: {
    label: string;
    path: string;
  };
  createdAt: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  loadNotifications: () => Promise<void>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateNotificationsFromStats = (stats: UserStats): Notification[] => {
    const notifications: Notification[] = [];

    if (stats.overdue_tasks > 0) {
      notifications.push({
        id: "overdue-tasks",
        type: "warning",
        title: "Tarefas em Atraso",
        message: `Você tem ${stats.overdue_tasks} tarefa(s) em atraso`,
        action: {
          label: "Ver Tarefas",
          path: "/tasks",
        },
        createdAt: new Date(),
        read: false,
      });
    }

    if (stats.pending_tasks > 0) {
      notifications.push({
        id: "pending-tasks",
        type: "info",
        title: "Tarefas Pendentes",
        message: `Você tem ${stats.pending_tasks} tarefa(s) pendente(s)`,
        action: {
          label: "Ver Tarefas",
          path: "/tasks",
        },
        createdAt: new Date(),
        read: false,
      });
    }

    if (stats.active_projects > 0) {
      notifications.push({
        id: "active-projects",
        type: "info",
        title: "Projetos Ativos",
        message: `Você tem ${stats.active_projects} projeto(s) em andamento`,
        action: {
          label: "Ver Projetos",
          path: "/projects",
        },
        createdAt: new Date(),
        read: false,
      });
    }

    return notifications;
  };

  const loadNotifications = async () => {
    try {
      setIsLoading(true);

      // Buscar estatísticas do usuário
      const stats = await usersService.getUserStats();

      // Gerar notificações baseadas nas estatísticas
      const newNotifications = generateNotificationsFromStats(stats);

      setNotifications(newNotifications);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    loadNotifications();

    // Recarregar notificações a cada 5 minutos
    const interval = setInterval(loadNotifications, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loadNotifications,
    isLoading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
