import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/formatters';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };
  
  const handleTest = () => {
    navigate('/test');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Cliq CRM</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Informações do usuário */}
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium">
                {getInitials(user?.name || '')}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            {/* Botões de ação */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfile}
                className="hidden sm:flex"
              >
                <User className="h-4 w-4 mr-2" />
                Perfil
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTest}
                className="hidden sm:flex"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Testes
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

