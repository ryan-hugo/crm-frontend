# Cliq CRM - Frontend

Sistema de gestão de relacionamento com clientes (CRM) desenvolvido em React com TypeScript.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis
- **React Router** - Roteamento para aplicações React
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas TypeScript
- **Axios** - Cliente HTTP para APIs
- **Lucide React** - Ícones SVG
- **Date-fns** - Manipulação de datas

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de interface básicos
│   ├── common/         # Componentes comuns (Layout, Header, etc.)
│   ├── auth/           # Componentes de autenticação
│   ├── contacts/       # Componentes específicos de contatos
│   ├── tasks/          # Componentes específicos de tarefas
│   ├── projects/       # Componentes específicos de projetos
│   └── interactions/   # Componentes específicos de interações
├── pages/              # Páginas da aplicação
├── services/           # Serviços de API
├── hooks/              # Hooks customizados
├── context/            # Contextos React
├── types/              # Definições de tipos TypeScript
├── utils/              # Utilitários e helpers
└── lib/                # Configurações de bibliotecas
```

## 🛠️ Funcionalidades

### ✅ Autenticação
- Login e registro de usuários
- Proteção de rotas
- Gerenciamento de sessão com JWT
- Logout automático em caso de token expirado

### ✅ Dashboard
- Visão geral das estatísticas
- Ações rápidas
- Indicadores de performance
- Atividades recentes

### ✅ Gestão de Contatos
- CRUD completo de contatos
- Diferenciação entre clientes e leads
- Conversão de leads em clientes
- Busca e filtros avançados

### ✅ Gestão de Tarefas
- Criação e gerenciamento de tarefas
- Prioridades (Alta, Média, Baixa)
- Status (Pendente, Concluída)
- Associação com contatos e projetos
- Identificação de tarefas em atraso

### ✅ Gestão de Projetos
- CRUD de projetos
- Acompanhamento de progresso
- Associação com clientes
- Status (Em Andamento, Concluído, Cancelado)

### ✅ Gestão de Interações
- Registro de comunicações
- Tipos: Email, Ligação, Reunião, Outros
- Histórico completo de interações
- Associação com contatos

### ✅ Perfil do Usuário
- Edição de informações pessoais
- Alteração de senha
- Avatar com iniciais

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd cliq-crm-frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com as configurações do seu backend:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Execute o projeto:**
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```

5. **Acesse a aplicação:**
   ```
   http://localhost:5173
   ```

## 🔌 Integração com Backend

O frontend está configurado para se conectar com uma API REST em Go. Os endpoints esperados são:

### Autenticação
- `POST /auth/login` - Login do usuário
- `POST /auth/register` - Registro de usuário
- `POST /auth/logout` - Logout
- `GET /auth/validate` - Validação de token

### Usuários
- `GET /users/profile` - Obter perfil
- `PUT /users/profile` - Atualizar perfil
- `PUT /users/change-password` - Alterar senha
- `GET /users/stats` - Estatísticas do usuário

### Contatos
- `GET /contacts` - Listar contatos
- `POST /contacts` - Criar contato
- `GET /contacts/:id` - Obter contato
- `PUT /contacts/:id` - Atualizar contato
- `DELETE /contacts/:id` - Excluir contato
- `PUT /contacts/:id/convert-to-client` - Converter lead em cliente

### Tarefas
- `GET /tasks` - Listar tarefas
- `POST /tasks` - Criar tarefa
- `GET /tasks/:id` - Obter tarefa
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Excluir tarefa
- `PUT /tasks/:id/complete` - Marcar como concluída
- `PUT /tasks/:id/uncomplete` - Marcar como pendente
- `GET /tasks/overdue` - Tarefas em atraso

### Projetos
- `GET /projects` - Listar projetos
- `POST /projects` - Criar projeto
- `GET /projects/:id` - Obter projeto
- `PUT /projects/:id` - Atualizar projeto
- `DELETE /projects/:id` - Excluir projeto

### Interações
- `GET /interactions` - Listar interações
- `POST /contacts/:id/interactions` - Criar interação
- `GET /interactions/:id` - Obter interação
- `PUT /interactions/:id` - Atualizar interação
- `DELETE /interactions/:id` - Excluir interação
- `GET /contacts/:id/interactions` - Interações de um contato

## 🎨 Design System

O projeto utiliza um design system baseado em:
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- **Lucide React** para ícones consistentes
- **Paleta de cores** profissional em tons de azul e cinza

### Componentes UI Disponíveis
- Button (variantes: default, destructive, outline, secondary, ghost, link)
- Input (com validação visual)
- Label (acessível)
- Card (header, content, footer)
- Badge (status e prioridades)

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🔒 Segurança

- Autenticação JWT com refresh automático
- Proteção de rotas sensíveis
- Validação de formulários no frontend e backend
- Sanitização de dados de entrada
- Headers de segurança configurados

## 🚀 Build e Deploy

### Build para Produção
```bash
npm run build
# ou
pnpm build
```

### Preview da Build
```bash
npm run preview
# ou
pnpm preview
```

### Deploy
O projeto pode ser deployado em qualquer serviço de hospedagem estática:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🧪 Testes

Para executar os testes (quando implementados):
```bash
npm run test
# ou
pnpm test
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato através do email: suporte@cliqcrm.com

---

**Cliq CRM** - Sistema de gestão de relacionamento com clientes moderno e eficiente.

# crm-frontend
