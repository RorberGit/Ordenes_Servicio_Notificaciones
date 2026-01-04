import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm, useWatch } from 'react-hook-form'
import { ZodResolverNotification, type ZodSchemaTypeNotification } from '../lib/ZodSchema'
import { Form } from '@/components/ui/form'
import {
  AutocompleteFormField,
  CheckboxFormField,
  InputFormField,
  MultiSelectFormField,
  SelectFormField,
  TextareaFormField,
} from '@/components/form-fields/'
import { useCreateRecord } from '@/hooks/useApiMutation'
import { toast } from 'sonner'
import { defaultValues, type Notification, type NotificationPayload } from '../types'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useWork } from '@/context/WorkContext'
import { useNavigate } from 'react-router-dom'
import useQueryNotication from '../hooks/use-QueryNotication'
import type { ApiError } from '@/pages/types/types-comun'
import { logger } from '@/lib/logger'

export default function FormNewNotification() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { activeWork } = useWork()

  const form = useForm<ZodSchemaTypeNotification>({
    resolver: ZodResolverNotification,
    defaultValues: defaultValues,
  })

  // Observa los valores de los campos para renderizado condicional
  const watchedLlevaRespuesta = useWatch({ control: form.control, name: 'lleva_respuesta' })
  // Observa el valor del campo 'tipo_contenido'
  const watchedTipoRespuesta = useWatch({ control: form.control, name: 'tipo_respuesta' })

  const {
    ordenServicioData,
    isLoadingOrdenServicio,
    ordenServicioError,
    tiposRespuestaData,
    isLoadingTiposRespuesta,
    tiposRespuestaError,
    especialidadesData,
    isLoadingEspecialidades,
    especialidadesError,
  } = useQueryNotication(watchedLlevaRespuesta, watchedTipoRespuesta)

  /*
   * Si lleva respuesta es falso Limpiar los componentes numero de orden que responde y especialidad
   */
  useEffect(() => {
    if (!watchedLlevaRespuesta) {
      // Limpiar campo Número de Orden que responde
      form.setValue('numero_orden_respuesta', '', { shouldValidate: true })
      form.clearErrors('numero_orden_respuesta')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedLlevaRespuesta])

  // * ✅ Verifica si tipo de contenido es Plano
  useEffect(() => {
    if (watchedTipoRespuesta !== 'Plano') {
      form.setValue('especialidad', [], { shouldValidate: true })
      form.clearErrors('especialidad')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedTipoRespuesta])

  // Hook para crear la notificación
  const createNotificationMutation = useCreateRecord<Notification, NotificationPayload>(
    '/notificaciones/create/',
    {
      onSuccess: data => {
        toast.success('Notificación creada exitosamente', {
          description: `Notificación #${data.data?.numero_notificacion || 'N/A'} ha sido registrada`,
        })
        form.reset()
        // Opcional: redirigir a la vista de la notificación creada o al listado
        navigate('/notifications/view', { replace: true, state: { refresh: true } })
      },
      onError: error => {
        logger.error('Error al crear la notificación:', error)
        const apiError = error as ApiError
        const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
        toast.error('Error al crear la notificación', {
          description: errorMessage,
        })
      },
    },
  )

  function onSubmit(values: ZodSchemaTypeNotification) {
    // Preparar los datos para enviar al API
    const dataToSend: NotificationPayload = {
      numero_notificacion: values.numero_notificacion,
      asunto: values.asunto,
      ...(watchedLlevaRespuesta && {
        lleva_respuesta: true,
        ...(values.numero_orden_respuesta && {
          numero_orden_respuesta: values.numero_orden_respuesta,
        }),
      }),
      ...(values.tipo_respuesta && { tipo_respuesta: values.tipo_respuesta }),
      ...(watchedTipoRespuesta === 'Plano' && {
        ...(values.especialidad &&
          values.especialidad.length > 0 && { especialidad: values.especialidad }),
      }),
      username: user?.username,
      estado: 1,
      obra: activeWork,
    }

    // Enviar los datos al API
    createNotificationMutation.mutate(dataToSend)
  }

  return (
    <Card className='mx-auto max-w-[800px] min-w-3/4'>
      <CardHeader>
        <CardTitle>Nueva Notificación</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Número de Orden */}
            <InputFormField
              control={form.control}
              name='numero_notificacion'
              label='Número de Notificación'
              placeholder='Ej: 0001'
              type='number'
            />

            {/* Asunto */}
            <TextareaFormField
              control={form.control}
              name='asunto'
              label='Asunto'
              placeholder='Descripción breve del contenido de la notificación'
              rows={3}
            />

            {/* Lleva Respuesta - Solo si hay órdenes de servicio disponibles */}
            <CheckboxFormField
              control={form.control}
              name='lleva_respuesta'
              label='Lleva Respuesta'
              description='Indica si la notificación requiere una respuesta'
            />

            {/* Número de Orden de Respuesta - Solo si lleva respuesta y hay órdenes disponibles */}
            {watchedLlevaRespuesta &&
              ordenServicioData?.data &&
              ordenServicioData.data.length > 0 && (
                <AutocompleteFormField
                  control={form.control}
                  name='numero_orden_respuesta'
                  label='Número de Orden que responde'
                  placeholder={
                    isLoadingOrdenServicio
                      ? 'Cargando Ordenes de Servicio...'
                      : ordenServicioError
                        ? 'Error al cargar las Ordenes de Servio'
                        : 'Seleccione una Orden de Servicio'
                  }
                  options={
                    ordenServicioData?.data?.map(orden => ({
                      value: orden.id,
                      label: `${orden.numero_orden} - ${
                        orden.asunto.length > 50 ? orden.asunto.slice(0, 50) + '...' : orden.asunto
                      }`,
                    })) || []
                  }
                />
              )}

            {/* Tipo de Respuesta - Solo si está pendiente de respuesta */}
            <SelectFormField
              control={form.control}
              name='tipo_respuesta'
              label='Tipo de contenido'
              placeholder={
                isLoadingTiposRespuesta
                  ? 'Cargando tipos de respuesta...'
                  : tiposRespuestaError
                    ? 'Error al cargar tipos de respuesta'
                    : 'Seleccione un tipo de respuesta'
              }
              options={
                tiposRespuestaData?.data?.map(tipo => ({
                  value: tipo.nombre,
                  label: tipo.nombre,
                })) || []
              }
            />

            {/* Especialidades - Solo si lleva respuesta */}
            {watchedTipoRespuesta === 'Plano' && (
              <MultiSelectFormField
                control={form.control}
                name='especialidad'
                label='Especialidades'
                placeholder={
                  isLoadingEspecialidades
                    ? 'Cargando especialidades...'
                    : especialidadesError
                      ? 'Error al cargar especialidades'
                      : 'Selecciona las especialidades que deben dar respuesta'
                }
                options={
                  especialidadesData?.data?.map(especialidad => ({
                    value: especialidad.id,
                    label: especialidad.nombre,
                  })) || []
                }
              />
            )}

            {/* Botones */}
            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                type='submit'
                className='bg-green-700 hover:bg-green-500'
                disabled={createNotificationMutation.isPending}
              >
                {createNotificationMutation.isPending ? 'Enviando...' : 'Crear Notificación'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
