import { useCreateRecord, useUpdateRecord } from '@/hooks/useApiMutation'
import type { Registro, useFormReg } from '../types'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'
import type { ApiError } from '@/pages/types/types-comun'
import type { ApiResponse } from '@/services/apiClient'

export default function useInsertEdit(form: useFormReg, RegaId: string | null) {
  const navigate = useNavigate()

  // Proceso satisfactorio
  const success = (data: ApiResponse<Registro>, title: string) => {
    toast.success(title, {
      description: `Registro #${data.data?.num || 'N/A'}`,
    })
    form.reset()
    navigate('/rega/view', { replace: true, state: { refresh: true } })
  }

  // Proceso con error
  const error = (err: Error, title: string) => {
    logger.error(title, err)
    const apiError = err as ApiError
    const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
    toast.error(title, {
      description: errorMessage,
    })
  }

  // ➕ Hook para crear el registro
  const createRegaMutation = useCreateRecord<Registro, unknown>('/registros/create/', {
    onSuccess: data => success(data, 'Registro creado exitosamente'),
    onError: err => error(err, 'Error al crear el registro'),
  })

  // ✏ Hook para actualizar el registro
  const updateRegaMutation = useUpdateRecord<Registro, unknown>(`/registros/update/${RegaId}/`, {
    onSuccess: data => success(data, 'Registro actualizado exitosamente'),
    onError: err => error(err, 'Error al actualizar el registro'),
  })

  return { createRegaMutation, updateRegaMutation }
}
