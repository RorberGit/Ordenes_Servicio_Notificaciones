import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { InputFormField } from '@/components/form-fields/InputFormField'
import { TextareaFormField } from '@/components/form-fields/TextareaFormField'
import { useCreateRecord, useUpdateRecord } from '@/hooks/useApiMutation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import type { TipoDocumentoResponse, TipoDocumentoPayload } from '../view/types'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import type { ApiError } from '@/pages/types/types-comun'
import { logger } from '@/lib/logger'

const tipodocumentoSchema = z.object({
  cod: z.string().min(1, 'El cod es requerido'),
  descripcion: z.string().optional(),
})

type TipoDocumentoFormData = z.infer<typeof tipodocumentoSchema>

export default function FormNewTipoDocumento() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tipodocumentoId = searchParams.get('id')

  const isEditing = !!tipodocumentoId

  const form = useForm<TipoDocumentoFormData>({
    resolver: zodResolver(tipodocumentoSchema),
    defaultValues: {
      cod: '',
      descripcion: '',
    },
  })

  // Query para obtener datos de la tipodocumento si estamos editando
  const { data: tipodocumentoData, isLoading: isLoadingTipoDocumento } =
    useApiQuery<TipoDocumentoResponse>({
      url: tipodocumentoId ? `/tipo-documento/getone?id=${tipodocumentoId}` : '',
      enabled: !!tipodocumentoId,
    })

  // Efecto para cargar datos en el formulario cuando se está editando
  useEffect(() => {
    if (tipodocumentoData?.data && isEditing) {
      form.reset({
        cod: tipodocumentoData.data.cod,
        descripcion: tipodocumentoData.data.descripcion || '',
      })
    }
  }, [tipodocumentoData, isEditing, form])

  // Hook para crear tipodocumento
  const createTipoDocumentoMutation = useCreateRecord<TipoDocumentoResponse, TipoDocumentoPayload>(
    '/tipo-documento/create/',
    {
      onSuccess: data => {
        toast.success('Tipo de documento creado exitosamente', {
          description: `Tipo de documento "${data.data?.cod}" ha sido registrado`,
        })
        form.reset()
        navigate('/config/tipo-documento/view', { replace: true, state: { refresh: true } })
      },
      onError: error => {
        logger.error('Error al crear el tipo de documento:', error)
        const apiError = error as ApiError
        const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
        toast.error('Error al crear el tipo de documento', {
          description: errorMessage,
        })
      },
    },
  )

  // Hook para actualizar tipodocumento
  const updateTipoDocumentoMutation = useUpdateRecord<TipoDocumentoResponse, TipoDocumentoPayload>(
    `/tipo-documento/update?id=${tipodocumentoId}`,
    {
      onSuccess: data => {
        toast.success('Tipo de documento actualizado exitosamente', {
          description: `Tipo de documento "${data.data?.cod}" ha sido actualizado`,
        })
        navigate('/config/tipo-documento/view', { replace: true, state: { refresh: true } })
      },
      onError: error => {
        logger.error('Error al actualizar el tipo de documento:', error)
        const apiError = error as ApiError
        const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
        toast.error('Error al actualizar el tipo de docuemnto', {
          description: errorMessage,
        })
      },
    },
  )

  // Función onSubmit del formulario
  const onSubmit = (values: TipoDocumentoFormData) => {
    const dataToSend: TipoDocumentoPayload = {
      cod: values.cod,
      descripcion: values.descripcion,
    }

    if (isEditing) {
      updateTipoDocumentoMutation.mutate(dataToSend)
    } else {
      createTipoDocumentoMutation.mutate(dataToSend)
    }
  }

  if (isLoadingTipoDocumento && isEditing) {
    return (
      <Card className='mx-auto max-w-[800px] min-w-3/4'>
        <CardHeader>
          <CardTitle>Cargando tipo de docuemnto...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className='mx-auto max-w-[800px] min-w-3/4'>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Tipo de documento' : 'Nueva Tipo de documento'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Código */}
            <InputFormField
              control={form.control}
              name='cod'
              label='Código'
              placeholder='Ingrese el código del tipo de documento'
            />

            {/* Descripción */}
            <TextareaFormField
              control={form.control}
              name='descripcion'
              label='Descripción'
              placeholder='Ingrese una descripción'
              rows={3}
            />

            {/* Botones */}
            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate('/config/tipo-documento/view')}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className='bg-green-700 hover:bg-green-500'
                disabled={
                  createTipoDocumentoMutation.isPending || updateTipoDocumentoMutation.isPending
                }
              >
                {createTipoDocumentoMutation.isPending || updateTipoDocumentoMutation.isPending
                  ? 'Guardando...'
                  : isEditing
                    ? 'Actualizar'
                    : 'Crear'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
