import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';
import type { ApiResponse, ApiError } from '../types/api';

// Criar instância do axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Permitir cookies para autenticação
});

// Interceptor para adicionar token de autenticação e logar requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log para debug
    console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
      params: config.params
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log para debug
    console.log(`✅ Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error: AxiosError) => {
    // Log para debug
    console.error(`❌ Response Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Se o token expirou, redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Função para definir o token de autenticação
export const setAuthToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

// Função para remover o token de autenticação
export const removeAuthToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Função para obter o token atual
export const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

// Funções auxiliares para chamadas HTTP
export const apiGet = async <T = any>(url: string, params?: any): Promise<T> => {
  try {
    const response = await api.get<ApiResponse<T>>(url, { params });
    
    // Log temporário para debug de tasks
    if (url.includes('/tasks/list')) {
      console.log("=== API GET DEBUG ===");
      console.log("URL:", url);
      console.log("Full response:", response);
      console.log("response.data:", response.data);
      console.log("response.data.data:", response.data.data);
      console.log("Returning:", (response.data.data || response.data));
      console.log("=== END API DEBUG ===");
    }
    
    return (response.data.data || response.data) as T;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const apiPost = async <T = any>(url: string, data?: any): Promise<T> => {
  try {
    const response = await api.post<ApiResponse<T>>(url, data);
    return (response.data.data || response.data) as T;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const apiPut = async <T = any>(url: string, data?: any): Promise<T> => {
  try {
    const response = await api.put<ApiResponse<T>>(url, data);
    return (response.data.data || response.data) as T;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

export const apiDelete = async <T = any>(url: string): Promise<T> => {
  try {
    const response = await api.delete<ApiResponse<T>>(url);
    return (response.data.data || response.data) as T;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

// Função para tratar erros da API
const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    // Erro de resposta do servidor
    const data = error.response.data as any;
    return {
      message: data?.message || data?.error || 'Erro no servidor',
      status: error.response.status,
      code: data?.code,
    };
  } else if (error.request) {
    // Erro de rede ou CORS
    if (error.code === 'ERR_NETWORK') {
      return {
        message: 'Erro de conexão com o servidor. Verifique se a API está rodando.',
        status: 0,
      };
    }
    return {
      message: 'Erro de conexão. Verifique sua internet.',
      status: 0,
    };
  } else {
    // Erro de configuração
    return {
      message: error.message || 'Erro inesperado',
      status: 0,
    };
  }
};

export default api;

