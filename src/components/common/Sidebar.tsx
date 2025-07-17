import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Briefcase, 
  MessageSquare,
  User,
  TestTube
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Contatos', href: '/contacts', icon: Users },
  { name: 'Tarefas', href: '/tasks', icon: CheckSquare },
  { name: 'Projetos', href: '/projects', icon: Briefcase },
  { name: 'Interações', href: '/interactions', icon: MessageSquare },
  { name: 'Perfil', href: '/profile', icon: User },
  { name: 'Testes', href: '/test', icon: TestTube },
];

const Sidebar: React.FC = () => {
  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200 pt-16">
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Cliq CRM v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

