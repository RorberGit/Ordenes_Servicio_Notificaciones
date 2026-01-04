import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { httpService, type ApiResponse } from '@/services/apiClient'

// Tipos para el hook personalizado
export interface UseApiQueryOptions<TData = unknown>
  extends Omit<UseQueryOptions<ApiResponse<TData>, Error>, 'queryKey' | 'queryFn'> {
  url: string
  params?: Record<string, unknown>
  queryKey?: string[]
}

// Hook personalizado para consultas GET con apiClient
export function useApiQuery<TData = unknown>({
  url,
  params,
  queryKey,
  enabled = true,
  ...options
}: UseApiQueryOptions<TData>): UseQueryResult<ApiResponse<TData>, Error> {
  // Generar queryKey automáticamente si no se proporciona
  const defaultQueryKey = queryKey || ['api', url, params ? JSON.stringify(params) : '']

  return useQuery({
    queryKey: defaultQueryKey,
    queryFn: async () => {
      const response = await httpService.get<ApiResponse<TData>>(url, params)
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos por defecto
    gcTime: 10 * 60 * 1000, // 10 minutos por defecto
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  })
}

// Tipos para el hook simple
export interface UseApiQuerySimpleOptions<TData = unknown>
  extends Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'> {
  url: string
  params?: Record<string, unknown>
  queryKey?: string[]
}

// Hook personalizado para consultas GET simples (sin envoltura ApiResponse)
export function useApiQuerySimple<TData = unknown>({
  url,
  params,
  queryKey,
  enabled = true,
  ...options
}: UseApiQuerySimpleOptions<TData>): UseQueryResult<TData, Error> {
  const defaultQueryKey = queryKey || ['api-simple', url, params ? JSON.stringify(params) : '']

  return useQuery({
    queryKey: defaultQueryKey,
    queryFn: async () => {
      const response = await httpService.get<TData>(url, params)
      return response.data
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  })
}
