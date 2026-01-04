import type { UseMutationResult } from '@tanstack/react-query'
import type { ZodSchemaTypeRega } from '../lib/ZodSchema'
import { mapRegaToFormData } from './rega-mapper'
import type { ApiResponse } from '@/services/apiClient'
import type { Registro } from '../types'

interface RegaSubmitParams {
  isEditing: boolean
  unidad: string
  usuario: string
  createRegaMutation: UseMutationResult<ApiResponse<Registro>, Error, unknown>
  updateRegaMutation: UseMutationResult<ApiResponse<Registro>, Error, unknown>
}

export const regaSubmit =
  ({ isEditing, unidad, usuario, createRegaMutation, updateRegaMutation }: RegaSubmitParams) =>
  (values: ZodSchemaTypeRega) => {
    const formData = mapRegaToFormData(values, {
      isEditing,
      unidad,
      usuario,
    })

    if (isEditing) {
      updateRegaMutation.mutate(formData)
    } else {
      createRegaMutation.mutate(formData)
    }
  }
