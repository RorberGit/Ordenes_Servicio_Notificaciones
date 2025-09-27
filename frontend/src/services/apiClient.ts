import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

// Configuración base de Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token de autenticación si existe
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Respuesta =>', response)
    // Manejar respuestas exitosas
    return response
  },
  error => {
    if (error.response?.status === 401) {
      // Token expirado, redirigir a login
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// Tipos para las respuestas
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

// Servicio genérico para hacer solicitudes HTTP
export const httpService = {
  get: <T = unknown>(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<T>> => {
    return apiClient.get(url, { params })
  },

  post: <T = unknown>(url: string, data?: unknown): Promise<AxiosResponse<T>> => {
    return apiClient.post(url, data)
  },

  put: <T = unknown>(url: string, data?: unknown): Promise<AxiosResponse<T>> => {
    return apiClient.put(url, data)
  },

  delete: <T = unknown>(url: string): Promise<AxiosResponse<T>> => {
    return apiClient.delete(url)
  },

  patch: <T = unknown>(url: string, data?: unknown): Promise<AxiosResponse<T>> => {
    return apiClient.patch(url, data)
  },
}

export default apiClient
