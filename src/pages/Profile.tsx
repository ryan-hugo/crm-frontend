import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { usersService } from '../services/users';
import { getInitials } from '../utils/formatters';
import { profileSchema, changePasswordSchema, type ProfileFormData, type ChangePasswordFormData } from '../utils/validators';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Formulário de perfil
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue: setValueProfile,
    formState: { errors: errorsProfile }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: ''
    }
  });

  // Formulário de senha
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: errorsPassword }
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const profileData = await usersService.getProfile();
      
      // Atualizar formulário com dados do perfil
      setValueProfile('name', profileData.name || '');
      setValueProfile('email', profileData.email || '');
      
      // Atualizar contexto do usuário se necessário
      if (profileData.name !== user?.name || profileData.email !== user?.email) {
        updateUser({
          ...user!,
          name: profileData.name,
          email: profileData.email
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data: ProfileFormData) => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      const updatedProfile = await usersService.updateProfile(data);
      
      // Atualizar contexto do usuário
      updateUser({
        ...user!,
        name: updatedProfile.name,
        email: updatedProfile.email
      });
      
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      await usersService.changePassword({
        current_password: data.current_password,
        new_password: data.new_password
      });
      
      resetPassword();
      setSuccess('Senha alterada com sucesso!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600 mt-2">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e configurações</p>
      </div>

      {/* Alerts */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}
      
      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <p className="text-green-700">{success}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar e Info Básica */}
        <Card>
          <CardHeader>
            <CardTitle>Foto do Perfil</CardTitle>
            <CardDescription>
              Sua foto de perfil e informações básicas
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-medium">
                {getInitials(user?.name || '')}
              </div>
              <div>
                <h3 className="text-lg font-medium">{user?.name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Alterar Foto
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Formulários */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações básicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProfile(handleUpdateProfile)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    {...registerProfile('name')}
                    className={errorsProfile.name ? 'border-red-500' : ''}
                  />
                  {errorsProfile.name && (
                    <p className="text-sm text-red-500">{errorsProfile.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...registerProfile('email')}
                    className={errorsProfile.email ? 'border-red-500' : ''}
                  />
                  {errorsProfile.email && (
                    <p className="text-sm text-red-500">{errorsProfile.email.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Alterar Senha */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Alterar Senha
              </CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPassword(handleChangePassword)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="current_password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...registerPassword('current_password')}
                      className={errorsPassword.current_password ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errorsPassword.current_password && (
                    <p className="text-sm text-red-500">{errorsPassword.current_password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password">Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showNewPassword ? 'text' : 'password'}
                      {...registerPassword('new_password')}
                      className={errorsPassword.new_password ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errorsPassword.new_password && (
                    <p className="text-sm text-red-500">{errorsPassword.new_password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...registerPassword('confirm_password')}
                      className={errorsPassword.confirm_password ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errorsPassword.confirm_password && (
                    <p className="text-sm text-red-500">{errorsPassword.confirm_password.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Alterando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Alterar Senha
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

