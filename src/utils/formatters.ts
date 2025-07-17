import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DATE_FORMATS } from './constants';

/**
 * Formatar data para exibição
 */
export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Data inválida';
    return format(dateObj, DATE_FORMATS.DISPLAY, { locale: ptBR });
  } catch {
    return 'Data inválida';
  }
};

/**
 * Formatar data e hora para exibição
 */
export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Data inválida';
    return format(dateObj, DATE_FORMATS.DISPLAY_WITH_TIME, { locale: ptBR });
  } catch {
    return 'Data inválida';
  }
};

/**
 * Formatar data para input HTML
 */
export const formatDateForInput = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, DATE_FORMATS.INPUT);
  } catch {
    return '';
  }
};

/**
 * Formatar telefone brasileiro
 */
export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Obter iniciais do nome
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Truncar texto
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formatar progresso
 */
export const formatProgress = (completed: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = Math.round((completed / total) * 100);
  return `${percentage}%`;
};

/**
 * Formatar moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Verificar se a data está em atraso
 */
export const isOverdue = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    return dateObj < new Date();
  } catch {
    return false;
  }
};

