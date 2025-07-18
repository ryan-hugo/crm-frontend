# CRM Frontend - Arquitetura & Funcionalidades

## 📋 Visão Geral

Este é um sistema de CRM (Customer Relationship Management) desenvolvido com React 18 e TypeScript, utilizando Vite como build tool. O projeto oferece uma interface moderna e responsiva para gerenciamento de contatos, tarefas, projetos e interações.

## 🏗️ Arquitetura

### Stack Tecnológica

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS + Radix UI
- **Validação:** Zod
- **Roteamento:** React Router v6
- **Gerenciamento de Estado:** React Hooks (useState, useEffect, useContext)

### Estrutura de Diretórios

```
src/
├── components/           # Componentes reutilizáveis
│   ├── auth/            # Componentes de autenticação
│   ├── common/          # Componentes compartilhados
│   ├── contacts/        # Componentes específicos de contatos
│   ├── interactions/    # Componentes de interações
│   ├── projects/        # Componentes de projetos
│   ├── tasks/          # Componentes de tarefas
│   └── ui/             # Componentes base de UI
├── context/            # Contextos React
├── hooks/              # Hooks customizados
├── lib/                # Bibliotecas e utilitários
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── types/              # Definições de tipos TypeScript
└── utils/              # Funções utilitárias
```

## 🧩 Componentes

### Componentes de UI Base (`src/components/ui/`)

- **Button:** Botão customizável com variantes
- **Card:** Container para conteúdo com header/content
- **Input:** Campo de entrada personalizado
- **Label:** Rótulos para formulários
- **Select:** Dropdown customizado
- **Tabs:** Sistema de abas
- **Dialog:** Modais e dialogs
- **Skeleton:** Loading placeholders

### Componentes Comuns (`src/components/common/`)

- **Header:** Cabeçalho da aplicação
- **Layout:** Layout principal com sidebar
- **Sidebar:** Menu lateral de navegação
- **ProtectedRoute:** Proteção de rotas autenticadas
- **ErrorMessage:** Exibição de mensagens de erro
- **LoadingSpinner:** Indicador de carregamento
- **ContactFilter:** Filtro de contatos reutilizável

### Componentes Específicos

#### Autenticação (`src/components/auth/`)

- **LoginForm:** Formulário de login

#### Contatos (`src/components/contacts/`)

- **ContactFormModal:** Modal para criação/edição de contatos
- **ContactDetailsModal:** Modal com detalhes do contato

#### Tarefas (`src/components/tasks/`)

- **TaskFormModal:** Modal para criação/edição de tarefas

#### Projetos (`src/components/projects/`)

- **ProjectFormModal:** Modal para criação/edição de projetos

#### Interações (`src/components/interactions/`)

- **InteractionFormModal:** Modal para registro de interações

## 📄 Páginas

### Dashboard (`src/pages/Dashboard.tsx`)

- Resumo de estatísticas (contatos, tarefas, projetos, interações)
- Cards de métricas e KPIs
- Atividade recente do usuário
- Ações rápidas para criação

### Contatos (`src/pages/Contacts.tsx`)

- Listagem paginada de contatos
- Busca por nome, email, empresa
- Filtro por tipo (cliente/lead)
- Modal de detalhes com estatísticas
- Criação, edição e exclusão

### Tarefas (`src/pages/Tasks.tsx`)

- Listagem paginada de tarefas
- Busca por título/descrição
- Filtro por status e contato
- Toggle de status (pendente/concluída)
- Indicadores de prioridade e atraso
- Criação, edição e exclusão

### Projetos (`src/pages/Projects.tsx`)

- Listagem de projetos
- Busca e filtros
- Associação com clientes
- Gestão de status

### Interações (`src/pages/Interactions.tsx`)

- Histórico de comunicações
- Filtro por contato
- Registro de diferentes tipos (email, ligação, reunião)

### Perfil (`src/pages/Profile.tsx`)

- Dados do usuário logado
- Configurações da conta

## 🔧 Serviços (`src/services/`)

### API Services

- **auth.ts:** Autenticação (login, registro, logout)
- **contacts.ts:** CRUD de contatos
- **tasks.ts:** CRUD de tarefas
- **projects.ts:** CRUD de projetos
- **interactions.ts:** CRUD de interações
- **users.ts:** Dados do usuário e estatísticas

### Estrutura dos Serviços

Todos os serviços seguem padrão RESTful:

- `GET` para listagem e detalhes
- `POST` para criação
- `PUT` para atualização
- `DELETE` para exclusão

## 🎯 Hooks Customizados (`src/hooks/`)

- **useAuth:** Gerenciamento de autenticação
- **useApi:** Requisições HTTP genéricas
- **useLocalStorage:** Persistência local

## 🔐 Contextos (`src/context/`)

### AuthContext

- Estado global de autenticação
- Informações do usuário logado
- Funções de login/logout

## 📝 Tipos TypeScript (`src/types/`)

### Entidades Principais

- **Contact:** Estrutura de contatos
- **Task:** Estrutura de tarefas
- **Project:** Estrutura de projetos
- **Interaction:** Estrutura de interações
- **User:** Dados do usuário

### Tipos de API

- Requests (Create/Update)
- Responses
- Filtros e parâmetros

## 🛠️ Utilitários (`src/utils/`)

- **formatters.ts:** Formatação de datas, telefones, etc.
- **validators.ts:** Esquemas de validação Zod
- **constants.ts:** Constantes da aplicação

## 🎨 UI/UX Features

### Loading States

- Skeleton loading para simulação de carregamento
- Loading spinners para operações
- Estados de erro com retry

### Responsividade

- Design mobile-first
- Layouts adaptativos
- Componentes flexíveis

### Feedback Visual

- Toasts para notificações
- Estados de validação
- Indicadores visuais (prioridade, status, etc.)

### Modais e Formulários

- Modais centralizados para operações CRUD
- Validação em tempo real
- Estados de loading e erro

## 🔄 Fluxos Principais

### Autenticação

1. Usuário acessa aplicação
2. Redirecionamento para login se não autenticado
3. AuthContext gerencia estado global
4. Proteção de rotas via ProtectedRoute

### Gestão de Dados

1. Carregamento com skeleton
2. Exibição em cards/listas
3. Filtros e busca em tempo real
4. Modais para operações CRUD
5. Feedback visual de sucesso/erro

### Paginação

- Implementada em tarefas
- Controles de navegação
- Informações de contexto (X de Y itens)

## 🔮 Arquitetura Extensível

### Padrões Implementados

- **Component Composition:** Reutilização via composição
- **Custom Hooks:** Lógica compartilhada
- **Service Layer:** Separação de responsabilidades
- **Type Safety:** TypeScript em toda aplicação

### Pontos de Extensão

- Novos módulos seguem estrutura estabelecida
- Componentes UI base reutilizáveis
- Serviços padronizados para novas entidades
- Contextos para estado global adicional

## 📊 Performance

### Otimizações

- Lazy loading de rotas
- Debounce em campos de busca
- Skeleton loading para UX
- Componentes otimizados

### Boas Práticas

- TypeScript para type safety
- Validação client-side
- Error boundaries
- Consistent loading states

---

> Esta arquitetura foi projetada para ser escalável, mantível e extensível, seguindo as melhores práticas do ecossistema React.
