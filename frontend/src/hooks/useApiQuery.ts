import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'
import { httpService, type ApiResponse } from '@/services/apiClient'

// ========================
// useApiQuery (con ApiResponse<TData>)
// ========================

export interface UseApiQueryOptions<TData = unknown>
  extends Omit<
    UseQueryOptions<ApiResponse<TData>, Error, ApiResponse<TData>>,
    'queryKey' | 'queryFn'
  > {
  url: string
  params?: Record<string, unknown>
  queryKey?: unknown[] // Mejor usar unknown[] para mayor flexibilidad
  enabled?: boolean
}

/**
 * Hook para consultas GET que devuelven ApiResponse<TData>
 * Ejemplo: { success: true, data: [...], message: '' }
 */
export function useApiQuery<TData = unknown>({
  url,
  params,
  queryKey,
  enabled = true,
  staleTime = 0, // Inmediatamente stale → siempre refetch en background
  gcTime = 5 * 60 * 1000, // 5 minutos en caché cuando no se usa
  retry = 3,
  retryDelay = (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  refetchOnWindowFocus = true, // Refetch al volver a la pestaña
  refetchOnReconnect = true, // Refetch al recuperar internet
  ...options
}: UseApiQueryOptions<TData>): UseQueryResult<ApiResponse<TData>, Error> {
  // Clave más robusta y segura (evita problemas con objetos no serializables)
  const defaultQueryKey = queryKey || [
    'api',
    url,
    params ? JSON.stringify(params) : null, // ordenar keys para consistencia
  ]

  return useQuery<ApiResponse<TData>, Error>({
    queryKey: defaultQueryKey,
    queryFn: async () => {
      const response = await httpService.get<ApiResponse<TData>>(url, params)
      return response.data // asumiendo que httpService ya devuelve { data: ApiResponse }
    },
    enabled,
    staleTime,
    gcTime,
    retry,
    retryDelay,
    refetchOnWindowFocus,
    refetchOnReconnect,
    ...options,
  })
}

// ========================
// useApiQuerySimple (devuelve directamente TData)
// ========================

export interface UseApiQuerySimpleOptions<TData = unknown>
  extends Omit<UseQueryOptions<TData, Error, TData>, 'queryKey' | 'queryFn'> {
  url: string
  params?: Record<string, unknown>
  queryKey?: unknown[]
  enabled?: boolean
}

export function useApiQuerySimple<TData = unknown>({
  url,
  params,
  queryKey,
  enabled = true,
  staleTime = 5 * 60 * 1000,
  gcTime = 10 * 60 * 1000,
  retry = 3,
  retryDelay = attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  ...options
}: UseApiQuerySimpleOptions<TData>): UseQueryResult<TData, Error> {
  const defaultQueryKey: unknown[] = queryKey ?? [
    'api-simple',
    url,
    params ? JSON.stringify(params, Object.keys(params).sort()) : null,
  ]

  return useQuery<TData, Error>({
    queryKey: defaultQueryKey,
    queryFn: async () => {
      const response = await httpService.get<TData>(url, { params })
      return response.data
    },
    enabled,
    staleTime,
    gcTime,
    retry,
    retryDelay,
    ...options,
  })
}
