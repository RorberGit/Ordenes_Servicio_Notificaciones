// form-body.tsx

import { AutocompleteFormField } from '@/components/form-fields/AutocompleteFormField'
import { FileUploadFormField } from '@/components/form-fields/FileUploadFormField'
import { SelectFormField } from '@/components/form-fields/SelectFormField'
import { TextareaFormField } from '@/components/form-fields/TextareaFormField'
import { Form } from '@/components/ui/form'
import { ZodResolverRega, type ZodSchemaTypeRega } from '../../lib/ZodSchema'
import { Button } from '@/components/ui/button'
import { defaultValues } from '../../types'
import { useForm } from 'react-hook-form'
import useInsertEdit from '../../hooks/use-InsertEdit'
import { regaSubmit } from '../../utils/rega-Submit'
import { useQueryRega } from '../../hooks/use-QueryRega'

interface Props {
  RegaId: string | null
}

export default function FormBodyRega({ RegaId }: Props) {
  // * En edision o nuevo registro
  const isEditing = !!RegaId

  // 📋 Implementación del formulaeio
  const form = useForm<ZodSchemaTypeRega>({
    resolver: ZodResolverRega,
    defaultValues: defaultValues,
  })

  // ✅ Obtener datos del usuario y la unidad
  const {
    regaData,
    usuario,
    unidad,
    procedenciaDestinoData,
    isLoadingProcedenciaDestino,
    procedenciaDestinoError,
    tipoDocumentoData,
    isLoadingTipoDocumento,
    tipoDocumentoError,
  } = useQueryRega(RegaId)

  // ➕ Hook para crear y actualizar el registro
  const { createRegaMutation, updateRegaMutation } = useInsertEdit(form, RegaId, regaData)

  // Controla el submit del formulario
  const pending = isEditing ? updateRegaMutation.isPending : createRegaMutation.isPending

  // Función onSubmit del formulario
  const onSubmit = regaSubmit({
    isEditing: isEditing,
    unidad,
    usuario,
    createRegaMutation,
    updateRegaMutation,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {/* Descripción */}
        <TextareaFormField
          control={form.control}
          name='descripcion'
          label='Descripción'
          placeholder='Describe el registro'
          rows={4}
        />

        {/* Entrada o Salida */}
        <SelectFormField
          control={form.control}
          name='entrada_salida'
          label='Entrada o Salida'
          placeholder='Seleccione Entrada o Salida'
          options={[
            { value: 'R/S', label: 'R/S' },
            { value: 'R/E', label: 'R/E' },
          ]}
        />

        {/* Procedencia o Destino */}
        <AutocompleteFormField
          control={form.control}
          name='procedencia_destino_id'
          label='Procedencia o Destino'
          placeholder={
            isLoadingProcedenciaDestino
              ? 'Cargando Procedencias/Destinos...'
              : procedenciaDestinoError
                ? 'Error al cargar Procedencias/Destinos'
                : 'Seleccione Procedencia o Destino'
          }
          options={
            procedenciaDestinoData?.data?.map(item => ({
              value: item.id,
              label: `${item.cod} - ${item.descripcion}`,
            })) || []
          }
        />

        {/* Tipo de Documento */}
        <AutocompleteFormField
          control={form.control}
          name='tipo_documento_id'
          label='Tipo de Documento'
          placeholder={
            isLoadingTipoDocumento
              ? 'Cargando Tipos de Documento...'
              : tipoDocumentoError
                ? 'Error al cargar Tipos de Documento'
                : 'Seleccione Tipo de Documento'
          }
          options={
            tipoDocumentoData?.data?.map(item => ({
              value: item.id,
              label: `${item.cod} - ${item.descripcion}`,
            })) || []
          }
        />

        {/* Archivo */}
        <FileUploadFormField
          control={form.control}
          name='archivo'
          label='Archivo Adjunto'
          placeholder='Seleccione un archivo PDF o MS Office'
        />

        {/* Botones */}
        <div className='flex justify-end space-x-2 pt-4'>
          <Button type='submit' className='bg-green-700 hover:bg-green-500' disabled={pending}>
            {pending ? 'Enviando...' : 'Aceptar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
