import { z } from 'zod';

// Validadores de autenticação
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Validadores de contato
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, 'Telefone deve ter pelo menos 10 dígitos'),
  company: z.string().optional(),
  position: z.string().optional(),
  type: z.enum(['CLIENT', 'LEAD']),
  notes: z.string().optional(),
});

// Validadores de tarefa
export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  due_date: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  contact_id: z.number().optional(),
  project_id: z.number().optional(),
});

// Validadores de projeto
export const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  client_id: z.number().optional(),
});

// Validadores de interação
export const interactionSchema = z.object({
  subject: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
  type: z.enum(['EMAIL', 'CALL', 'MEETING', 'OTHER']),
  contact_id: z.number().min(1, 'Contato é obrigatório'),
});

// Validadores de perfil
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
});

export const changePasswordSchema = z.object({
  current_password: z
    .string()
    .min(1, 'Senha atual é obrigatória'),
  new_password: z
    .string()
    .min(1, 'Nova senha é obrigatória')
    .min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirm_password: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'As senhas não coincidem',
  path: ['confirm_password'],
});

// Tipos derivados dos schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type InteractionFormData = z.infer<typeof interactionSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

