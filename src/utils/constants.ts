// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'cliq_crm_token',
  USER: 'cliq_crm_user',
} as const;

// Status Colors
export const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
  CLIENT: 'bg-blue-100 text-blue-800',
  LEAD: 'bg-orange-100 text-orange-800',
} as const;

// Priority Colors
export const PRIORITY_COLORS = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
} as const;

// Interaction Colors
export const INTERACTION_COLORS = {
  EMAIL: 'bg-blue-100 text-blue-800',
  CALL: 'bg-green-100 text-green-800',
  MEETING: 'bg-purple-100 text-purple-800',
  OTHER: 'bg-gray-100 text-gray-800',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  API: 'yyyy-MM-dd',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

