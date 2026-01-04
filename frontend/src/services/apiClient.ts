// apiClient.ts
import axios from 'axios'
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios'
import { authService } from './authService'
import { logger } from '@/lib/logger'

// 1. Instancia de Axios sin configurar (solo con las opciones base)
let apiClient: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 2. Variable para almacenar la URL cargada
export let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
// Se mantiene VITE_API_URL como fallback para el entorno de desarrollo

// 3. Función para cargar la configuración desde public/config.json
const loadConfig = async () => {
  try {
    const response = await fetch('/config.json')
    if (!response.ok) {
      throw new Error('Config file not found or failed to load')
    }
    const config = await response.json()

    // Asignar la URL cargada al cliente
    API_BASE_URL = config.api_url || API_BASE_URL

    // **IMPORTANTE**: Reconfigurar la instancia de apiClient con el nuevo baseURL
    apiClient = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    })

    // Aplicar interceptores a la nueva instancia
    apiClient.interceptors.request.use(setupRequestInterceptor, error => Promise.reject(error))
    apiClient.interceptors.response.use((response: AxiosResponse) => {
      logger.info('Response apiClient =>', response)
      return response
    }, setupResponseInterceptor)
  } catch (error) {
    logger.error('Error al cargar config.json. Usando URL por defecto:', API_BASE_URL, error)
  }
}

// 4. Promesa que garantiza que la configuración se ha cargado
// Esto se usa en el servicio HTTP para esperar la carga.
const configLoadedPromise = loadConfig()

// 5. Función de Interceptor para Solicitudes
// Nota: Esta función debe ser genérica y se aplicará a la instancia después de loadConfig()
const setupRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const access_token = authService.getAccessToken()

  if (access_token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${access_token}`
  }
  return config
}

// 6. Función de Interceptor para Respuestas (Manejo de 401)
const setupResponseInterceptor = async (error: AxiosError) => {
  logger.error('Errores response API', error)

  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

  if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
    originalRequest._retry = true

    const refreshToken = authService.getRefreshToken()

    if (refreshToken) {
      try {
        // **ATENCIÓN**: Usamos la variable API_BASE_URL aquí, no apiClient.defaults.baseURL
        // ya que esta última puede no estar actualizada si usamos la instancia inicial.
        const { data } = await apiClient.post('/auth/refresh/', {
          refresh: refreshToken,
        })

        authService.setTokens(data.access, data.refresh)
        apiClient.defaults.headers.common.Authorization = `Bearer ${data.access}`

        originalRequest.headers.Authorization = `Bearer ${data.access}`

        // Llamar a la nueva instancia de apiClient, que ya tiene la baseURL correcta
        return apiClient(originalRequest as AxiosRequestConfig)
      } catch (err) {
        logger.error('Error interceptor refresh :> ', err)
        authService.clear()
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }
  }

  return Promise.reject(error)
}

// 8. Servicio genérico envuelto en una función ASÍNCRONA que espera la carga
export const httpService = {
  get: async <T = unknown>(
    url: string,
    params?: Record<string, unknown>,
  ): Promise<AxiosResponse<T>> => {
    await configLoadedPromise // Esperar a que la configuración esté lista
    return apiClient.get(url, { params })
  },

  post: async <T = unknown>(url: string, data?: unknown): Promise<AxiosResponse<T>> => {
    await configLoadedPromise

    // Si data es FormData, usar configuración sin Content-Type
    if (data instanceof FormData) {
      return apiClient.post(url, data, {
        headers: {
          //Authorization: apiClient.defaults.headers.Authorization,
          'Content-Type': undefined,
        },
      })
    }

    return apiClient.post(url, data)
  },

  put: async <T = unknown>(url: string, data?: unknown): Promise<AxiosResponse<T>> => {
    await configLoadedPromise

    // Si data es FormData, usar configuración sin Content-Type
    if (data instanceof FormData) {
      return apiClient.put(url, data, {
        headers: {
          //Authorization: apiClient.defaults.headers.Authorization,
          'Content-Type': undefined,
        },
      })
    }

    return apiClient.put(url, data)
  },

  delete: async <T = unknown>(url: string): Promise<AxiosResponse<T>> => {
    await configLoadedPromise
    return apiClient.delete(url)
  },

  patch: async <T = unknown>(url: string, data?: unknown): Promise<AxiosResponse<T>> => {
    await configLoadedPromise
    return apiClient.patch(url, data)
  },
}

// Tipos de respuesta
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export default apiClient
