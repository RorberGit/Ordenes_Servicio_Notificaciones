// form-body.tsx

import { AutocompleteFormField } from '@/components/form-fields/AutocompleteFormField'
import { FileUploadFormField } from '@/components/form-fields/FileUploadFormField'
import { SelectFormField } from '@/components/form-fields/SelectFormField'
import { TextareaFormField } from '@/components/form-fields/TextareaFormField'
import { Form } from '@/components/ui/form'
import type { ZodSchemaTypeRega } from '../../lib/ZodSchema'
import { Button } from '@/components/ui/button'
import type { ProcedenciaDestino, TipoDocumento, useFormReg } from '../../types'
import type { ApiResponse } from '@/services/apiClient'

type ProcedenciaDestinoResponse = ProcedenciaDestino[]

type TipoDocumentoResponse = TipoDocumento[]

interface Props {
  form: useFormReg
  onSubmit: (values: ZodSchemaTypeRega) => void
  ProcesMutation: boolean

  procedenciaDestinoData: ApiResponse<ProcedenciaDestinoResponse> | undefined
  isLoadingProcedenciaDestino: boolean
  procedenciaDestinoError: Error | null

  tipoDocumentoData: ApiResponse<TipoDocumentoResponse> | undefined
  isLoadingTipoDocumento: boolean
  tipoDocumentoError: Error | null
}

export default function FormBodyRega({
  form,
  onSubmit,
  ProcesMutation,
  procedenciaDestinoData,
  isLoadingProcedenciaDestino,
  procedenciaDestinoError,
  tipoDocumentoData,
  isLoadingTipoDocumento,
  tipoDocumentoError,
}: Props) {
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
          <Button
            type='submit'
            className='bg-green-700 hover:bg-green-500'
            disabled={ProcesMutation}
          >
            {ProcesMutation ? 'Enviando...' : 'Aceptar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
