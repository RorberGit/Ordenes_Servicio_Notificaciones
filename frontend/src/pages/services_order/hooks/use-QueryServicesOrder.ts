import { useEffect } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { toast } from 'sonner'
import type { UseFormReturn } from 'react-hook-form'
import type { ZodSchemaTypeOS } from '../lib/ZodSchema'
import type { TiposContenidoResponse } from '../types'
import type { EspecialidadesResponse } from '@/pages/types/types-comun'
import type { NotificationsResponse } from '@/pages/notifications/types'

export function useQueyServicesOrder(form: UseFormReturn<ZodSchemaTypeOS>) {
  const watchedContenido = form.watch('tipo_contenido')

  // * API Tipo Contenido
  const {
    data: tiposContenidoData,
    isLoading: isLoadingTiposContenido,
    error: tiposContenidoError,
  } = useApiQuery<TiposContenidoResponse>({
    url: '/tipos-contenido/getall/',
    queryKey: ['tipos-contenido'],
  })

  // * API Especialidades
  const {
    data: especialidadesData,
    isLoading: isLoadingEspecialidades,
    error: especialidadesError,
  } = useApiQuery<EspecialidadesResponse>({
    url: '/especialidades/getall/',
    queryKey: ['especialidades'],
    enabled: watchedContenido === 'Plano',
  })

  // * Query para obtener notificaciones
  const {
    data: notificacionesData,
    isLoading: isLoadingNotificaciones,
    error: notificacionesError,
  } = useApiQuery<NotificationsResponse>({
    url: '/notificaciones/getall/',
    queryKey: ['notificaciones'],
  })

  useEffect(() => {
    if (watchedContenido !== 'Plano') {
      form.setValue('especialidad', [], { shouldValidate: true })
      form.clearErrors('especialidad')
    }
  }, [watchedContenido, form])

  useEffect(() => {
    if (tiposContenidoError) {
      toast.error('Error al cargar tipos de contenido', {
        description: 'Se usarán valores por defecto. Verifique su conexión.',
      })
    }
  }, [tiposContenidoError])

  useEffect(() => {
    if (especialidadesError && watchedContenido === 'Plano') {
      toast.error('Error al cargar especialidades', {
        description: 'Se usarán valores por defecto. Verifique su conexión.',
      })
    }
  }, [especialidadesError, watchedContenido])

  return {
    tiposContenidoData,
    isLoadingTiposContenido,
    tiposContenidoError,
    especialidadesData,
    isLoadingEspecialidades,
    especialidadesError,
    notificacionesData,
    isLoadingNotificaciones,
    notificacionesError,
  }
}
