import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  TestTube, 
  Bell, 
  Settings, 
  ChevronDown,
  Building2,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/formatters';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount] = useState(3); // Mock notification count

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getPageTitle = () => {
    const pathMap: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/contacts': 'Contatos',
      '/tasks': 'Tarefas',
      '/projects': 'Projetos', 
      '/interactions': 'Interações',
      '/profile': 'Perfil',
      '/test': 'Testes'
    };
    return pathMap[location.pathname] || 'CRM';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Breadcrumb */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">Cliq CRM</h1>
              </div>
            </div>
            
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <Home className="h-4 w-4" />
              <span>/</span>
              <span className="text-gray-900 font-medium">{getPageTitle()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={() => handleNavigation('/notifications')}
            >
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium">
                    {getInitials(user?.name || '')}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => handleNavigation('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => handleNavigation('/test')}>
                  <TestTube className="mr-2 h-4 w-4" />
                  <span>Testes</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

