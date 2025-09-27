import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { ZodResolverOS, type ZodSchemaTypeOS } from '../lib/ZodSchema'
import { Form } from '@/components/ui/form'
import { useEffect } from 'react'
import { InputFormField } from '@/components/form-fields/InputFormField'
import { TextareaFormField } from '@/components/form-fields/TextareaFormField'
import { DatePickerFormField } from '@/components/form-fields/DatePickerFormField'
import { SelectFormField } from '@/components/form-fields/SelectFormField'
import { useCreateRecord } from '@/hooks/useApiMutation'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

// Tipo para la respuesta del API
interface ServiceOrderResponse {
  id: string
  numero_orden: number
  asunto: string
  fecha_notificacion?: string
  notificacion?: number
  tipo_contenido: string
  especialidad?: string
  created_at: string
  updated_at: string
}

// Tipo para los datos que se envían al API
interface ServiceOrderPayload {
  numero_orden: number
  asunto: string
  fecha_notificacion?: string
  notificacion?: number
  tipo_contenido: string
  especialidad?: string
}

// Tipo para errores de la API
interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export default function FormNewOS() {
  const navigate = useNavigate()

  const form = useForm<ZodSchemaTypeOS>({
    resolver: ZodResolverOS,
    defaultValues: {
      numero_orden: undefined,
      asunto: '',
      fecha_notificacion: undefined,
      notificacion: undefined,
      tipo_contenido: '',
      especialidad: undefined,
    },
  })

  // Hook para crear la orden de servicio
  const createOrderMutation = useCreateRecord<ServiceOrderResponse, ServiceOrderPayload>(
    '/services-orders',
    {
      onSuccess: data => {
        toast.success('Orden de servicio creada exitosamente', {
          description: `Orden #${data.data?.numero_orden || 'N/A'} ha sido registrada`,
        })
        form.reset()
        // Opcional: redirigir a la vista de la orden creada o al listado
        // navigate('/services-orders')
      },
      onError: error => {
        console.error('Error al crear la orden de servicio:', error)
        const apiError = error as ApiError
        const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
        toast.error('Error al crear la orden de servicio', {
          description: errorMessage,
        })
      },
    },
  )

  // 1. Observa el valor del campo 'tipo_contenido'
  const watchedContenido = form.watch('tipo_contenido')

  // 2. Efecto para resetear 'especialidad' si 'contenido' cambia y no es 'plano'
  useEffect(() => {
    if (watchedContenido !== 'plano') {
      // Resetea el valor de 'especialidad' y borra sus errores
      form.setValue('especialidad', undefined, { shouldValidate: true })
      form.clearErrors('especialidad')
    }
  }, [watchedContenido, form]) // Dependencias del efecto

  function onSubmit(values: ZodSchemaTypeOS) {
    // Preparar los datos para enviar al API
    const dataToSend: ServiceOrderPayload = {
      numero_orden: values.numero_orden,
      asunto: values.asunto,
      tipo_contenido: values.tipo_contenido,
      // Convertir la fecha a formato ISO string si existe
      fecha_notificacion: values.fecha_notificacion?.toISOString(),
      // Incluir campos opcionales solo si tienen valor
      ...(values.notificacion && { notificacion: values.notificacion }),
      ...(values.especialidad && { especialidad: values.especialidad }),
    }

    // Enviar los datos al API
    createOrderMutation.mutate(dataToSend)
  }

  return (
    <Card className='mx-auto max-w-[800px] min-w-3/4'>
      <CardHeader>
        <CardTitle>Nueva Orden de Servicio</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Número de Orden de Servicio */}
            <InputFormField
              control={form.control}
              name='numero_orden'
              label='Número de Orden de Servicio'
              placeholder='Ej: 12345'
              type='number'
            />

            {/* Asunto */}
            <TextareaFormField
              control={form.control}
              name='asunto'
              label='Asunto'
              placeholder='Describe brevemente la Orden de Servicio'
              rows={4}
            />

            {/* Fecha de Notificación */}
            <DatePickerFormField
              control={form.control}
              name='fecha_notificacion'
              label='Fecha de Notificación'
            />

            {/* Notificación que responde */}
            <InputFormField
              control={form.control}
              name='notificacion'
              label='Notificación que responde'
              placeholder='Número de notificación al que responde esta OS'
              type='number'
            />

            {/* Contenido */}
            <SelectFormField
              control={form.control}
              name='tipo_contenido'
              label='Contenido'
              placeholder='Seleccione un tipo de contenido'
              options={[
                { value: 'plano', label: 'Plano' },
                { value: 'ft', label: 'FT (Ficha Técnica)' },
                { value: 'sloc', label: 'SL/OC' },
                { value: 'otros', label: 'Otros' },
              ]}
            />

            {/* Especialidad */}
            {/* Renderizado Condicional: Solo muestra Especialidad si contenido es 'plano' */}
            {watchedContenido === 'plano' && (
              <SelectFormField
                control={form.control}
                name='especialidad'
                label='Especialidad'
                placeholder='Selecciona la especialidad de la OS'
                options={[
                  { value: 'arquitetura', label: 'Arquitectura' },
                  { value: 'estructura', label: 'Estructura' },
                  { value: 'mecanica', label: 'Mecánica' },
                  { value: 'electricidad', label: 'Electricidad' },
                  { value: 'hidrosanitaria', label: 'Hidrosanitaria' },
                ]}
              />
            )}

            {/* Botones */}
            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                type='submit'
                className='bg-green-700 hover:bg-green-500'
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? 'Enviando...' : 'Aceptar'}
              </Button>
              <Button type='button' variant='destructive' onClick={() => form.reset()}>
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
