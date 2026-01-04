import type { ZodSchemaTypeRega } from '../lib/ZodSchema'

interface RegaMapperParams {
  isEditing: boolean
  unidad: string
  usuario: string
}

export const mapRegaToFormData = (
  values: ZodSchemaTypeRega,
  { isEditing, unidad, usuario }: RegaMapperParams,
) => {
  const formData = new FormData()

  formData.append('descripcion', values.descripcion || '')
  formData.append('ent_sal', values.entrada_salida || '')

  if (values.procedencia_destino_id) {
    formData.append('procedencia_destino_id', values.procedencia_destino_id)
  }

  if (values.tipo_documento_id) {
    formData.append('tipo_documento_id', values.tipo_documento_id)
  }

  if (!isEditing) {
    formData.append('unidad_id', unidad)
    formData.append('usuario_id', usuario)
  }

  if (values.archivo) {
    formData.append('archivo', values.archivo)
  }

  return formData
}
