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
import type { EspecialidadResponse, EspecialidadPayload } from '../view/types'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApiQuery } from '@/hooks/useApiQuery'
import type { ApiError } from '@/pages/types/types-comun'

const especialidadSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
})

type EspecialidadFormData = z.infer<typeof especialidadSchema>

export default function FormNewEspecialidad() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const especialidadId = searchParams.get('id')

  const isEditing = !!especialidadId

  const form = useForm<EspecialidadFormData>({
    resolver: zodResolver(especialidadSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
  })

  // Query para obtener datos de la especialidad si estamos editando
  const { data: especialidadData, isLoading: isLoadingEspecialidad } =
    useApiQuery<EspecialidadResponse>({
      url: especialidadId ? `/especialidades/getone?id=${especialidadId}` : '',
      enabled: !!especialidadId,
    })

  // Efecto para cargar datos en el formulario cuando se está editando
  useEffect(() => {
    if (especialidadData?.data && isEditing) {
      form.reset({
        nombre: especialidadData.data.nombre,
        descripcion: especialidadData.data.descripcion || '',
      })
    }
  }, [especialidadData, isEditing, form])

  // Hook para crear especialidad
  const createEspecialidadMutation = useCreateRecord<EspecialidadResponse, EspecialidadPayload>(
    '/especialidades/create/',
    {
      onSuccess: data => {
        toast.success('Especialidad creada exitosamente', {
          description: `Especialidad "${data.data?.nombre}" ha sido registrada`,
        })
        form.reset()
        navigate('/config/especialidades/view', { replace: true, state: { refresh: true } })
      },
      onError: error => {
        console.error('Error al crear la especialidad:', error)
        const apiError = error as ApiError
        const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
        toast.error('Error al crear la especialidad', {
          description: errorMessage,
        })
      },
    },
  )

  // Hook para actualizar especialidad
  const updateEspecialidadMutation = useUpdateRecord<EspecialidadResponse, EspecialidadPayload>(
    `/especialidades/update?id=${especialidadId}`,
    {
      onSuccess: data => {
        toast.success('Especialidad actualizada exitosamente', {
          description: `Especialidad "${data.data?.nombre}" ha sido actualizada`,
        })
        navigate('/config/especialidades/view', { replace: true, state: { refresh: true } })
      },
      onError: error => {
        console.error('Error al actualizar la especialidad:', error)
        const apiError = error as ApiError
        const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
        toast.error('Error al actualizar la especialidad', {
          description: errorMessage,
        })
      },
    },
  )

  // Función onSubmit del formulario
  const onSubmit = (values: EspecialidadFormData) => {
    const dataToSend: EspecialidadPayload = {
      nombre: values.nombre,
      descripcion: values.descripcion,
    }

    if (isEditing) {
      updateEspecialidadMutation.mutate(dataToSend)
    } else {
      createEspecialidadMutation.mutate(dataToSend)
    }
  }

  if (isLoadingEspecialidad && isEditing) {
    return (
      <Card className='mx-auto max-w-[800px] min-w-3/4'>
        <CardHeader>
          <CardTitle>Cargando especialidad...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className='mx-auto max-w-[800px] min-w-3/4'>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Especialidad' : 'Nueva Especialidad'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Nombre */}
            <InputFormField
              control={form.control}
              name='nombre'
              label='Nombre'
              placeholder='Ingrese el nombre de la especialidad'
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
                onClick={() => navigate('/config/especialidades/view')}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className='bg-green-700 hover:bg-green-500'
                disabled={
                  createEspecialidadMutation.isPending || updateEspecialidadMutation.isPending
                }
              >
                {createEspecialidadMutation.isPending || updateEspecialidadMutation.isPending
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
