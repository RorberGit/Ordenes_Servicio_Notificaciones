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
import type { ObraResponse, ObraPayload } from '../view/types'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApiQuery } from '@/hooks/useApiQuery'
import type { ApiError } from '@/pages/types/types-comun'

const obraSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
})

type ObraFormData = z.infer<typeof obraSchema>

export default function FormNewObra() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const obraId = searchParams.get('id')

  const isEditing = !!obraId

  const form = useForm<ObraFormData>({
    resolver: zodResolver(obraSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
  })

  // Query para obtener datos de la obra si estamos editando
  const { data: obraData, isLoading: isLoadingObra } = useApiQuery<ObraResponse>({
    url: obraId ? `/obras/getone?id=${obraId}` : '',
    enabled: !!obraId,
  })

  // Efecto para cargar datos en el formulario cuando se está editando
  useEffect(() => {
    if (obraData?.data && isEditing) {
      form.reset({
        nombre: obraData.data.nombre,
        descripcion: obraData.data.descripcion || '',
      })
    }
  }, [obraData, isEditing, form])

  // Hook para crear obra
  const createObraMutation = useCreateRecord<ObraResponse, ObraPayload>('/obras/create/', {
    onSuccess: data => {
      toast.success('Obra creada exitosamente', {
        description: `Obra "${data.data?.nombre}" ha sido registrada`,
      })
      form.reset()
      navigate('/config/obra/view', { replace: true, state: { refresh: true } })
    },
    onError: error => {
      console.error('Error al crear la obra:', error)
      const apiError = error as ApiError
      const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
      toast.error('Error al crear la obra', {
        description: errorMessage,
      })
    },
  })

  // Hook para actualizar obra
  const updateObraMutation = useUpdateRecord<ObraResponse, ObraPayload>(
    `/obras/update?id=${obraId}`,
    {
      onSuccess: data => {
        toast.success('Obra actualizada exitosamente', {
          description: `Obra "${data.data?.nombre}" ha sido actualizada`,
        })
        navigate('/config/obra/view', { replace: true, state: { refresh: true } })
      },
      onError: error => {
        console.error('Error al actualizar la obra:', error)
        const apiError = error as ApiError
        const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
        toast.error('Error al actualizar la obra', {
          description: errorMessage,
        })
      },
    },
  )

  // Función onSubmit del formulario
  const onSubmit = (values: ObraFormData) => {
    const dataToSend: ObraPayload = {
      nombre: values.nombre,
      descripcion: values.descripcion,
    }

    if (isEditing) {
      updateObraMutation.mutate(dataToSend)
    } else {
      createObraMutation.mutate(dataToSend)
    }
  }

  if (isLoadingObra && isEditing) {
    return (
      <Card className='mx-auto max-w-[800px] min-w-3/4'>
        <CardHeader>
          <CardTitle>Cargando obra...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className='mx-auto max-w-[800px] min-w-3/4'>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Obra' : 'Nueva Obra'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Nombre */}
            <InputFormField
              control={form.control}
              name='nombre'
              label='Nombre'
              placeholder='Ingrese el nombre de la obra'
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
              <Button type='button' variant='outline' onClick={() => navigate('/config/obra/view')}>
                Cancelar
              </Button>
              <Button
                type='submit'
                className='bg-green-700 hover:bg-green-500'
                disabled={createObraMutation.isPending || updateObraMutation.isPending}
              >
                {createObraMutation.isPending || updateObraMutation.isPending
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
