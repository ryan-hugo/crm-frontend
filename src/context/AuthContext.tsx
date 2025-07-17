import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/auth';
import type { User, AuthContextType } from '../types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Verificar se há token no localStorage
      if (!authService.isAuthenticated()) {
        setUser(null);
        return;
      }

      // Tentar validar o token com o servidor
      const userData = await authService.validateToken();
      setUser(userData);
      authService.saveUser(userData);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      // Se der erro, limpar dados locais
      authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const response = await authService.login({ email, password });
      
      const userData: User = {
        id: response.user_id,
        name: response.name,
        email: response.email,
      };
      
      setUser(userData);
      authService.saveUser(userData);
      
      return { success: true, message: 'Login realizado com sucesso!' };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: error.message || 'Erro ao fazer login. Tente novamente.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const response = await authService.register({ name, email, password });
      
      const userData: User = {
        id: response.user_id,
        name: response.name,
        email: response.email,
      };
      
      setUser(userData);
      authService.saveUser(userData);
      
      return { success: true, message: 'Conta criada com sucesso!' };
    } catch (error: any) {
      console.error('Erro no registro:', error);
      return { 
        success: false, 
        message: error.message || 'Erro ao criar conta. Tente novamente.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      await authService.logout();
      setUser(null);
      
      return { success: true, message: 'Logout realizado com sucesso!' };
    } catch (error: any) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar estado local
      setUser(null);
      return { 
        success: false, 
        message: error.message || 'Erro ao fazer logout.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: User): void => {
    setUser(userData);
    authService.saveUser(userData);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

