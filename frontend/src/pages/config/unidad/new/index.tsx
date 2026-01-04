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
import type { UnidadResponse, UnidadPayload } from '../view/types'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import type { ApiError } from '@/pages/types/types-comun'
import { logger } from '@/lib/logger'

const unidadSchema = z.object({
  cod: z.string().min(1, 'El cod es requerido'),
  descripcion: z.string().optional(),
})

type UnidadFormData = z.infer<typeof unidadSchema>

export default function FormNewUnidad() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const unidadId = searchParams.get('id')

  const isEditing = !!unidadId

  const form = useForm<UnidadFormData>({
    resolver: zodResolver(unidadSchema),
    defaultValues: {
      cod: '',
      descripcion: '',
    },
  })

  // Query para obtener datos de la unidad si estamos editando
  const { data: unidadData, isLoading: isLoadingUnidad } = useApiQuery<UnidadResponse>({
    url: unidadId ? `/unidad/getone?id=${unidadId}` : '',
    enabled: !!unidadId,
  })

  // Efecto para cargar datos en el formulario cuando se está editando
  useEffect(() => {
    if (unidadData?.data && isEditing) {
      form.reset({
        cod: unidadData.data.cod,
        descripcion: unidadData.data.descripcion || '',
      })
    }
  }, [unidadData, isEditing, form])

  // Hook para crear unidad
  const createUnidadMutation = useCreateRecord<UnidadResponse, UnidadPayload>('/unidad/create/', {
    onSuccess: data => {
      toast.success('Unidad creada exitosamente', {
        description: `Unidad "${data.data?.cod}" ha sido registrada`,
      })
      form.reset()
      navigate('/config/unidad/view', { replace: true, state: { refresh: true } })
    },
    onError: error => {
      logger.error('Error al crear la unidad:', error)
      const apiError = error as ApiError
      const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
      toast.error('Error al crear la unidad', {
        description: errorMessage,
      })
    },
  })

  // Hook para actualizar unidad
  const updateUnidadMutation = useUpdateRecord<UnidadResponse, UnidadPayload>(
    `/unidad/update?id=${unidadId}`,
    {
      onSuccess: data => {
        toast.success('Unidad actualizada exitosamente', {
          description: `Unidad "${data.data?.cod}" ha sido actualizada`,
        })
        navigate('/config/unidad/view', { replace: true, state: { refresh: true } })
      },
      onError: error => {
        logger.error('Error al actualizar la unidad:', error)
        const apiError = error as ApiError
        const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
        toast.error('Error al actualizar la unidad', {
          description: errorMessage,
        })
      },
    },
  )

  // Función onSubmit del formulario
  const onSubmit = (values: UnidadFormData) => {
    const dataToSend: UnidadPayload = {
      cod: values.cod,
      descripcion: values.descripcion,
    }

    if (isEditing) {
      updateUnidadMutation.mutate(dataToSend)
    } else {
      createUnidadMutation.mutate(dataToSend)
    }
  }

  if (isLoadingUnidad && isEditing) {
    return (
      <Card className='mx-auto max-w-[800px] min-w-3/4'>
        <CardHeader>
          <CardTitle>Cargando unidad...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className='mx-auto max-w-[800px] min-w-3/4'>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Unidad' : 'Nueva Unidad'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Código */}
            <InputFormField
              control={form.control}
              name='cod'
              label='Código'
              placeholder='Ingrese el código de la unidad'
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
                onClick={() => navigate('/config/unidad/view')}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className='bg-green-700 hover:bg-green-500'
                disabled={createUnidadMutation.isPending || updateUnidadMutation.isPending}
              >
                {createUnidadMutation.isPending || updateUnidadMutation.isPending
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
