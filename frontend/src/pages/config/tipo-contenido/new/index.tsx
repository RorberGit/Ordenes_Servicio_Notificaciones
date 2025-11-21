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
import type { TipoContenidoResponse, TipoContenidoPayload } from '../view/types'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApiQuery } from '@/hooks/useApiQuery'
import type { ApiError } from '@/pages/types/types-comun'

const tipoContenidoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
})

type TipoContenidoFormData = z.infer<typeof tipoContenidoSchema>

export default function FormNewTipoContenido() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tipoContenidoId = searchParams.get('id')

  const isEditing = !!tipoContenidoId

  const form = useForm<TipoContenidoFormData>({
    resolver: zodResolver(tipoContenidoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
  })

  // Query para obtener datos del tipo de contenido si estamos editando
  const { data: tipoContenidoData, isLoading: isLoadingTipoContenido } =
    useApiQuery<TipoContenidoResponse>({
      url: tipoContenidoId ? `/tipos-contenido/getone?id=${tipoContenidoId}` : '',
      enabled: !!tipoContenidoId,
    })

  // Efecto para cargar datos en el formulario cuando se está editando
  useEffect(() => {
    if (tipoContenidoData?.data && isEditing) {
      form.reset({
        nombre: tipoContenidoData.data.nombre,
        descripcion: tipoContenidoData.data.descripcion || '',
      })
    }
  }, [tipoContenidoData, isEditing, form])

  // Hook para crear tipo de contenido
  const createTipoContenidoMutation = useCreateRecord<TipoContenidoResponse, TipoContenidoPayload>(
    '/tipos-contenido/create/',
    {
      onSuccess: data => {
        toast.success('Tipo de contenido creado exitosamente', {
          description: `Tipo de contenido "${data.data?.nombre}" ha sido registrado`,
        })
        form.reset()
        navigate('/config/tipo-contenido/view', { replace: true, state: { refresh: true } })
      },
      onError: error => {
        console.error('Error al crear el tipo de contenido:', error)
        const apiError = error as ApiError
        const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
        toast.error('Error al crear el tipo de contenido', {
          description: errorMessage,
        })
      },
    },
  )

  // Hook para actualizar tipo de contenido
  const updateTipoContenidoMutation = useUpdateRecord<TipoContenidoResponse, TipoContenidoPayload>(
    `/tipos-contenido/update?id=${tipoContenidoId}`,
    {
      onSuccess: data => {
        toast.success('Tipo de contenido actualizado exitosamente', {
          description: `Tipo de contenido "${data.data?.nombre}" ha sido actualizado`,
        })
        navigate('/config/tipo-contenido/view', { replace: true, state: { refresh: true } })
      },
      onError: error => {
        console.error('Error al actualizar el tipo de contenido:', error)
        const apiError = error as ApiError
        const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
        toast.error('Error al actualizar el tipo de contenido', {
          description: errorMessage,
        })
      },
    },
  )

  // Función onSubmit del formulario
  const onSubmit = (values: TipoContenidoFormData) => {
    const dataToSend: TipoContenidoPayload = {
      nombre: values.nombre,
      descripcion: values.descripcion,
    }

    if (isEditing) {
      updateTipoContenidoMutation.mutate(dataToSend)
    } else {
      createTipoContenidoMutation.mutate(dataToSend)
    }
  }

  if (isLoadingTipoContenido && isEditing) {
    return (
      <Card className='mx-auto max-w-[800px] min-w-3/4'>
        <CardHeader>
          <CardTitle>Cargando tipo de contenido...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className='mx-auto max-w-[800px] min-w-3/4'>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Tipo de Contenido' : 'Nuevo Tipo de Contenido'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Nombre */}
            <InputFormField
              control={form.control}
              name='nombre'
              label='Nombre'
              placeholder='Ingrese el nombre del tipo de contenido'
            />

            {/* Descripción */}
            <TextareaFormField
              control={form.control}
              name='descripcion'
              label='Descripción'
              placeholder='Ingrese una descripción opcional'
              rows={3}
            />

            {/* Botones */}
            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate('/config/tipo-contenido/view')}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className='bg-green-700 hover:bg-green-500'
                disabled={
                  createTipoContenidoMutation.isPending || updateTipoContenidoMutation.isPending
                }
              >
                {createTipoContenidoMutation.isPending || updateTipoContenidoMutation.isPending
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
