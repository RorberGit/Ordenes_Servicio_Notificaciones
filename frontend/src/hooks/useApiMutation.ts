import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query'
import { httpService, type ApiResponse } from '@/services/apiClient'
import { logger } from '@/lib/logger'

// Tipos para las operaciones de mutación
export type MutationMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface UseApiMutationOptions<TData = unknown, TVariables = unknown>
  extends Omit<UseMutationOptions<ApiResponse<TData>, Error, TVariables>, 'mutationFn'> {
  url: string
  method?: MutationMethod
  invalidateQueries?: string[][]
}

// Hook personalizado para mutaciones (POST, PUT, PATCH, DELETE)
export function useApiMutation<TData = unknown, TVariables = unknown>({
  url,
  method = 'POST',
  invalidateQueries = [],
  onSuccess,
  onError,
  ...options
}: UseApiMutationOptions<TData, TVariables>): UseMutationResult<
  ApiResponse<TData>,
  Error,
  TVariables
> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      let response

      switch (method) {
        case 'POST':
          response = await httpService.post<ApiResponse<TData>>(url, variables)
          break
        case 'PUT':
          response = await httpService.put<ApiResponse<TData>>(url, variables)
          break
        case 'PATCH':
          response = await httpService.patch<ApiResponse<TData>>(url, variables)
          break
        case 'DELETE':
          response = await httpService.delete<ApiResponse<TData>>(url)
          break
        default:
          throw new Error(`Método HTTP no soportado: ${method}`)
      }

      return response.data
    },
    onSuccess: (data, variables, context, mutation) => {
      // Invalidar queries relacionadas
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey })
      })

      // Ejecutar callback personalizado
      if (onSuccess) {
        onSuccess(data, variables, context, mutation)
      }
    },
    onError: (error, variables, context, mutation) => {
      logger.error(`Error en ${method} ${url}:`, error)

      // Ejecutar callback personalizado
      if (onError) {
        onError(error, variables, context, mutation)
      }
    },
    ...options,
  })
}

// Hook específico para crear registros (POST)
export function useCreateRecord<TData = unknown, TVariables = unknown>(
  url: string,
  options?: Omit<UseApiMutationOptions<TData, TVariables>, 'url' | 'method'>,
) {
  return useApiMutation({
    url,
    method: 'POST',
    ...options,
  })
}

// Hook específico para actualizar registros (PUT)
export function useUpdateRecord<TData = unknown, TVariables = unknown>(
  url: string,
  options?: Omit<UseApiMutationOptions<TData, TVariables>, 'url' | 'method'>,
) {
  return useApiMutation({
    url,
    method: 'PUT',
    ...options,
  })
}

// Hook específico para actualizar parcialmente (PATCH)
export function usePatchRecord<TData = unknown, TVariables = unknown>(
  url: string,
  options?: Omit<UseApiMutationOptions<TData, TVariables>, 'url' | 'method'>,
) {
  return useApiMutation({
    url,
    method: 'PATCH',
    ...options,
  })
}

// Hook específico para eliminar registros (DELETE)
export function useDeleteRecord<TData = unknown>(
  url: string,
  options?: Omit<UseApiMutationOptions<TData, void>, 'url' | 'method'>,
) {
  return useApiMutation({
    url,
    method: 'DELETE',
    ...options,
  })
}
