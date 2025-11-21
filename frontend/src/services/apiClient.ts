import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { authService } from './authService'

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
    const access_token = authService.getAccessToken()

    console.log('token en uso =>', access_token)

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`
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
    console.log('Response apiClient =>', response)
    // Manejar respuestas exitosas
    return response
  },
  async error => {
    console.log('Errores response API', error)

    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Obtener el refresh tokens
      const refreshToken = authService.getRefreshToken()

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh/`, {
            refresh: refreshToken,
          })

          // Almacenar nuevos tokens
          authService.setTokens(data.access, data.refresh)

          //apiClient.defaults.headers.common.Authorization = `Bearer ${data.access}`
          //? Actualizar la solicitud con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${data.access}`

          return apiClient(originalRequest)
        } catch (error) {
          console.error('Error interceptor refresh :> ', error)

          authService.clear()

          window.location.href = '/login'
        }
      }
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
