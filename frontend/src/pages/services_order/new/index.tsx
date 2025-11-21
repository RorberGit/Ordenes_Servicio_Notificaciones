import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { ZodResolverOS, type ZodSchemaTypeOS } from '../lib/ZodSchema'
import { Form } from '@/components/ui/form'
import { TextareaFormField } from '@/components/form-fields/TextareaFormField'
import { SelectFormField } from '@/components/form-fields/SelectFormField'
import { AutocompleteFormField } from '@/components/form-fields/AutocompleteFormField'
import { MultiSelectFormField } from '@/components/form-fields/MultiSelectFormField'
import { CheckboxFormField } from '@/components/form-fields/CheckboxFormField'
import { useCreateRecord } from '@/hooks/useApiMutation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import type { ServiceOrder, ServiceOrderPayload } from '../types'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useWork } from '@/context/WorkContext'
import { useQueyServicesOrder } from '../hooks/use-QueryServicesOrder'
import type { ApiError } from '@/pages/types/types-comun'

export default function FormNewOS() {
  const navigate = useNavigate()
  // Obtener usuario
  const { user } = useAuth()
  const { activeWork } = useWork()

  const form = useForm<ZodSchemaTypeOS>({
    resolver: ZodResolverOS,
    defaultValues: {
      asunto: '',
      notificacion: undefined,
      tipo_contenido: '',
      lleva_respuesta: false,
      especialidad: [],
    },
  })

  const {
    tiposContenidoData,
    isLoadingTiposContenido,
    tiposContenidoError,
    isLoadingEspecialidades,
    especialidadesData,
    especialidadesError,
    notificacionesData,
    isLoadingNotificaciones,
    notificacionesError,
  } = useQueyServicesOrder(form)

  // Hook para crear la orden de servicio
  const createOrderMutation = useCreateRecord<ServiceOrder, ServiceOrderPayload>(
    '/ordenes/create/',
    {
      onSuccess: data => {
        toast.success('Orden de servicio creada exitosamente', {
          description: `Orden #${data.data?.numero_orden || 'N/A'} ha sido registrada`,
        })
        form.reset()
        // Opcional: redirigir a la vista de la orden creada o al listado

        navigate('/serviceorder/view', { replace: true, state: { refresh: true } })
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

  // Observa el valor del campo 'tipo_contenido'
  const watchedContenido = form.watch('tipo_contenido')
  const watchedLlevaRespuesta = form.watch('lleva_respuesta')

  /*
   * Si lleva respuesta es falso Limpiar los componentes notificacion, tipo_contenido y especialidad
   */
  useEffect(() => {
    if (!watchedLlevaRespuesta) {
      // Limpiar campos
      form.setValue('notificacion', '', { shouldValidate: true })
      form.clearErrors('notificacion')
      form.setValue('tipo_contenido', '', { shouldValidate: true })
      form.clearErrors('tipo_contenido')
      form.setValue('especialidad', [], { shouldValidate: true })
      form.clearErrors('especialidad')
    }
  }, [form, watchedLlevaRespuesta])

  // Función onSubmit del formulario
  const onSubmit = (values: ZodSchemaTypeOS) => {
    // Preparar los datos para enviar al API
    const dataToSend: ServiceOrderPayload = {
      estado: 1,
      asunto: values.asunto,
      tipo_contenido: values.tipo_contenido || '',
      ...(values.notificacion && { notificacion: values.notificacion || '' }),
      ...(values.lleva_respuesta && { lleva_respuesta: values.lleva_respuesta }),
      ...(values.especialidad && { especialidad: values.especialidad || [] }),
      username: user?.username,
      obra: activeWork,
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
            {/* Asunto */}
            <TextareaFormField
              control={form.control}
              name='asunto'
              label='Asunto'
              placeholder='Describe brevemente la Orden de Servicio'
              rows={4}
            />

            {/* Lleva Respuesta */}
            <CheckboxFormField
              control={form.control}
              name='lleva_respuesta'
              label='Lleva Respuesta'
              description='Indica si la orden de servicio requiere una respuesta'
            />

            {/* Notificación que responde - Solo mostrar si lleva respuesta y hay notificaciones disponibles */}
            {watchedLlevaRespuesta &&
              notificacionesData?.data &&
              notificacionesData.data.length > 0 && (
                <AutocompleteFormField
                  control={form.control}
                  name='notificacion'
                  label='Notificación que responde'
                  placeholder={
                    isLoadingNotificaciones
                      ? 'Cargando notificaciones...'
                      : notificacionesError
                        ? 'Error al cargar notificaciones'
                        : 'Seleccione una notificación'
                  }
                  options={notificacionesData.data.map(notificacion => ({
                    value: notificacion.id,
                    label: `${notificacion.numero_notificacion} - ${
                      notificacion?.asunto.length > 50
                        ? notificacion.asunto.slice(0, 50) + '...'
                        : notificacion.asunto
                    }`,
                  }))}
                />
              )}

            {/* Tipo de Contenido - Solo si lleva respuesta */}
            <SelectFormField
              control={form.control}
              name='tipo_contenido'
              label='Tipo de Contenido'
              placeholder={
                isLoadingTiposContenido
                  ? 'Cargando Tipos de Contenido...'
                  : tiposContenidoError
                    ? 'Error al cargar Tipos de Contenido'
                    : 'Seleccione un Tipo de Contenido'
              }
              options={
                tiposContenidoData?.data?.map(tipo => ({
                  value: tipo.nombre,
                  label: tipo.nombre,
                })) || []
              }
            />

            {/* Especialidad */}
            {/* Renderizado Condicional: Solo muestra Especialidad si contenido es 'plano' */}
            {watchedContenido === 'Plano' && (
              <MultiSelectFormField
                control={form.control}
                name='especialidad'
                label='Especialidad'
                placeholder={
                  isLoadingEspecialidades
                    ? 'Cargando especialidades...'
                    : especialidadesError
                      ? 'Error al cargar especialidades'
                      : 'Selecciona las especialidades de la OS'
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
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? 'Enviando...' : 'Aceptar'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
