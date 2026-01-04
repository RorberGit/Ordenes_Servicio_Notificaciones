import { useCreateRecord, useUpdateRecord } from '@/hooks/useApiMutation'
import type { Registro, RegistroOne, useFormReg } from '../types'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'
import type { ApiError } from '@/pages/types/types-comun'
import type { ApiResponse } from '@/services/apiClient'
import { useEffect } from 'react'

export default function useInsertEdit(
  form: useFormReg,
  RegaId: string | null,
  regaData: ApiResponse<RegistroOne> | undefined,
) {
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

  // Cargar datos del registro para editar
  useEffect(() => {
    const isEditing = !!RegaId

    if (isEditing && regaData?.data && form) {
      const registro = regaData?.data.registro_actual

      setTimeout(() => {
        form.reset({
          descripcion: registro.descripcion || '',
          entrada_salida: registro.ent_sal || 'R/S',
          procedencia_destino_id: registro.procedencia_destino?.id || '',
          tipo_documento_id: registro.tipo_documento?.id || '',
          archivo: undefined, // No cargamos el archivo existente, solo permitimos cambiarlo
        })
      }, 100)
    }
  }, [regaData, form, RegaId])

  return { createRegaMutation, updateRegaMutation }
}
