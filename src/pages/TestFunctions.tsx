import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { contactsService } from '../services/contacts';
import { tasksService } from '../services/tasks';
import { projectsService } from '../services/projects';
import { interactionsService } from '../services/interactions';

const TestFunctions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState<any>(null);

  // Estados para contatos
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactType, setContactType] = useState('CLIENT');

  // Estados para tarefas
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');

  // Estados para projetos
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  // Estados para interações
  const [interactionContactId, setInteractionContactId] = useState('');
  const [interactionType, setInteractionType] = useState('EMAIL');
  const [interactionNotes, setInteractionNotes] = useState('');

  // Criar Contato
  const handleCreateContact = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setResult(null);

      if (!contactName || !contactEmail || !contactType) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      const response = await contactsService.createContact({
        name: contactName,
        email: contactEmail,
        type: contactType as 'CLIENT' | 'LEAD',
        phone: '',
      });

      setSuccess('Contato criado com sucesso!');
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar contato');
      console.error('Erro ao criar contato:', err);
    } finally {
      setLoading(false);
    }
  };

  // Criar Tarefa
  const handleCreateTask = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setResult(null);

      if (!taskTitle || !taskPriority) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      const response = await tasksService.createTask({
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority as 'LOW' | 'MEDIUM' | 'HIGH',
      });

      setSuccess('Tarefa criada com sucesso!');
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar tarefa');
      console.error('Erro ao criar tarefa:', err);
    } finally {
      setLoading(false);
    }
  };

  // Criar Projeto
  const handleCreateProject = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setResult(null);

      if (!projectName) {
        setError('O nome do projeto é obrigatório');
        return;
      }

      const response = await projectsService.createProject({
        name: projectName,
        description: projectDescription,
      });

      setSuccess('Projeto criado com sucesso!');
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar projeto');
      console.error('Erro ao criar projeto:', err);
    } finally {
      setLoading(false);
    }
  };

  // Criar Interação
  const handleCreateInteraction = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setResult(null);

      if (!interactionContactId || !interactionType) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      const contactId = parseInt(interactionContactId, 10);
      if (isNaN(contactId)) {
        setError('ID do contato inválido');
        return;
      }

      const date = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      
      const response = await interactionsService.createInteraction(contactId, {
        type: interactionType as 'EMAIL' | 'CALL' | 'MEETING' | 'OTHER',
        notes: interactionNotes,
        date,
      });

      setSuccess('Interação criada com sucesso!');
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar interação');
      console.error('Erro ao criar interação:', err);
    } finally {
      setLoading(false);
    }
  };

  // Listar Contatos
  const handleListContacts = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setResult(null);

      const response = await contactsService.getContacts();

      setSuccess('Contatos carregados com sucesso!');
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar contatos');
      console.error('Erro ao carregar contatos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Listar Tarefas
  const handleListTasks = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setResult(null);

      const response = await tasksService.getTasks();

      setSuccess('Tarefas carregadas com sucesso!');
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar tarefas');
      console.error('Erro ao carregar tarefas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Listar Projetos
  const handleListProjects = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setResult(null);

      const response = await projectsService.getProjects();

      setSuccess('Projetos carregados com sucesso!');
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar projetos');
      console.error('Erro ao carregar projetos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Listar Interações
  const handleListInteractions = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      setResult(null);

      const response = await interactionsService.getInteractions();

      setSuccess('Interações carregadas com sucesso!');
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar interações');
      console.error('Erro ao carregar interações:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Teste de Funcionalidades</CardTitle>
          <CardDescription>
            Teste as funcionalidades da API diretamente pelo frontend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="contacts">Contatos</TabsTrigger>
              <TabsTrigger value="tasks">Tarefas</TabsTrigger>
              <TabsTrigger value="projects">Projetos</TabsTrigger>
              <TabsTrigger value="interactions">Interações</TabsTrigger>
            </TabsList>
            
            {/* Contatos */}
            <TabsContent value="contacts" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Nome</Label>
                  <Input
                    id="contact-name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nome do contato"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-type">Tipo</Label>
                  <Select value={contactType} onValueChange={setContactType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLIENT">Cliente</SelectItem>
                      <SelectItem value="LEAD">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleCreateContact} disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Contato'}
                  </Button>
                  <Button onClick={handleListContacts} disabled={loading} variant="outline">
                    Listar Contatos
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Tarefas */}
            <TabsContent value="tasks" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Título</Label>
                  <Input
                    id="task-title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Título da tarefa"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="task-description">Descrição</Label>
                  <Input
                    id="task-description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Descrição da tarefa"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="task-priority">Prioridade</Label>
                  <Select value={taskPriority} onValueChange={setTaskPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Baixa</SelectItem>
                      <SelectItem value="MEDIUM">Média</SelectItem>
                      <SelectItem value="HIGH">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleCreateTask} disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Tarefa'}
                  </Button>
                  <Button onClick={handleListTasks} disabled={loading} variant="outline">
                    Listar Tarefas
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Projetos */}
            <TabsContent value="projects" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Nome</Label>
                  <Input
                    id="project-name"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Nome do projeto"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-description">Descrição</Label>
                  <Input
                    id="project-description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Descrição do projeto"
                  />
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleCreateProject} disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Projeto'}
                  </Button>
                  <Button onClick={handleListProjects} disabled={loading} variant="outline">
                    Listar Projetos
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Interações */}
            <TabsContent value="interactions" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interaction-contact-id">ID do Contato</Label>
                  <Input
                    id="interaction-contact-id"
                    type="number"
                    value={interactionContactId}
                    onChange={(e) => setInteractionContactId(e.target.value)}
                    placeholder="ID do contato"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interaction-type">Tipo</Label>
                  <Select value={interactionType} onValueChange={setInteractionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMAIL">Email</SelectItem>
                      <SelectItem value="CALL">Ligação</SelectItem>
                      <SelectItem value="MEETING">Reunião</SelectItem>
                      <SelectItem value="OTHER">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interaction-notes">Notas</Label>
                  <Input
                    id="interaction-notes"
                    value={interactionNotes}
                    onChange={(e) => setInteractionNotes(e.target.value)}
                    placeholder="Notas sobre a interação"
                  />
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleCreateInteraction} disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Interação'}
                  </Button>
                  <Button onClick={handleListInteractions} disabled={loading} variant="outline">
                    Listar Interações
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Mensagens de feedback */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              <h3 className="font-semibold mb-1">Erro:</h3>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
              <h3 className="font-semibold mb-1">Sucesso:</h3>
              <p>{success}</p>
            </div>
          )}

          {/* Resultados da API */}
          {result && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Resultado da API:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60 text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestFunctions;
