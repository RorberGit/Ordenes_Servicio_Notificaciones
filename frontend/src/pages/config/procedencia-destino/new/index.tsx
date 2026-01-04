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
import type { ProcedenciaDestinoResponse, ProcedenciaDestinoPayload } from '../view/types'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import type { ApiError } from '@/pages/types/types-comun'
import { logger } from '@/lib/logger'

const procedenciadestinoSchema = z.object({
  cod: z.string().min(1, 'El cod es requerido'),
  descripcion: z.string().optional(),
})

type ProcedenciaDestinoFormData = z.infer<typeof procedenciadestinoSchema>

export default function FormNewProcedenciaDestino() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const procedenciadestinoId = searchParams.get('id')

  const isEditing = !!procedenciadestinoId

  const form = useForm<ProcedenciaDestinoFormData>({
    resolver: zodResolver(procedenciadestinoSchema),
    defaultValues: {
      cod: '',
      descripcion: '',
    },
  })

  // Query para obtener datos de la procedenciadestino si estamos editando
  const { data: procedenciadestinoData, isLoading: isLoadingProcedenciaDestino } =
    useApiQuery<ProcedenciaDestinoResponse>({
      url: procedenciadestinoId ? `/procedencia-destino/getone?id=${procedenciadestinoId}` : '',
      enabled: !!procedenciadestinoId,
    })

  // Efecto para cargar datos en el formulario cuando se está editando
  useEffect(() => {
    if (procedenciadestinoData?.data && isEditing) {
      form.reset({
        cod: procedenciadestinoData.data.cod,
        descripcion: procedenciadestinoData.data.descripcion || '',
      })
    }
  }, [procedenciadestinoData, isEditing, form])

  // Hook para crear procedenciadestino
  const createProcedenciaDestinoMutation = useCreateRecord<
    ProcedenciaDestinoResponse,
    ProcedenciaDestinoPayload
  >('/procedencia-destino/create/', {
    onSuccess: data => {
      toast.success('Procedencia o destino creado exitosamente', {
        description: `Procedencia o destino "${data.data?.cod}" ha sido registrada`,
      })
      form.reset()
      navigate('/config/procedencia-destino/view', { replace: true, state: { refresh: true } })
    },
    onError: error => {
      logger.error('Error al crear la procedencia o destino:', error)
      const apiError = error as ApiError
      const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
      toast.error('Error al crear la procedencia o destino', {
        description: errorMessage,
      })
    },
  })

  // Hook para actualizar procedenciadestino
  const updateProcedenciaDestinoMutation = useUpdateRecord<
    ProcedenciaDestinoResponse,
    ProcedenciaDestinoPayload
  >(`/procedencia-destino/update?id=${procedenciadestinoId}`, {
    onSuccess: data => {
      toast.success('Procedencia o destino actualizada exitosamente', {
        description: `Procedencia o destino "${data.data?.cod}" ha sido actualizada`,
      })
      navigate('/config/procedencia-destino/view', { replace: true, state: { refresh: true } })
    },
    onError: error => {
      logger.error('Error al actualizar la procedencia o destino:', error)
      const apiError = error as ApiError
      const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
      toast.error('Error al actualizar la procedencia o destino', {
        description: errorMessage,
      })
    },
  })

  // Función onSubmit del formulario
  const onSubmit = (values: ProcedenciaDestinoFormData) => {
    const dataToSend: ProcedenciaDestinoPayload = {
      cod: values.cod,
      descripcion: values.descripcion,
    }

    if (isEditing) {
      updateProcedenciaDestinoMutation.mutate(dataToSend)
    } else {
      createProcedenciaDestinoMutation.mutate(dataToSend)
    }
  }

  if (isLoadingProcedenciaDestino && isEditing) {
    return (
      <Card className='mx-auto max-w-[800px] min-w-3/4'>
        <CardHeader>
          <CardTitle>Cargando procedencia o destino...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className='mx-auto max-w-[800px] min-w-3/4'>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Editar Procedencia o destino' : 'Nueva Procedencia o destino'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Código */}
            <InputFormField
              control={form.control}
              name='cod'
              label='Código'
              placeholder='Ingrese el código de la procedencia o destino'
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
                onClick={() => navigate('/config/procedencia-destino/view')}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className='bg-green-700 hover:bg-green-500'
                disabled={
                  createProcedenciaDestinoMutation.isPending ||
                  updateProcedenciaDestinoMutation.isPending
                }
              >
                {createProcedenciaDestinoMutation.isPending ||
                updateProcedenciaDestinoMutation.isPending
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
