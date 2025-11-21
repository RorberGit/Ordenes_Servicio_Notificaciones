import { useApiQuery } from '@/hooks/useApiQuery'
import type { ServicesOrderResponse } from '@/pages/services_order/types'
import type { TiposDeRespuestaResponse } from '../types'
import { useEffect } from 'react'
import { toast } from 'sonner'
import type { EspecialidadesResponse } from '@/pages/types/types-comun'

export default function useQueryNotication() {
  // Hook para obtener las Ordenes de servicio
  const {
    data: ordenServicioData,
    isLoading: isLoadingOrdenServicio,
    error: ordenServicioError,
  } = useApiQuery<ServicesOrderResponse>({
    url: '/ordenes/getall/',
    queryKey: ['ordenesservicio'],
  })

  useEffect(() => {
    if (ordenServicioError) {
      toast.error('Error al cargar las Ordenes de Servicio', {
        description: 'Se usarán valores por defecto.',
      })
    }
  }, [ordenServicioError])

  // * Hook para obtener tipos de respuesta
  const {
    data: tiposRespuestaData,
    isLoading: isLoadingTiposRespuesta,
    error: tiposRespuestaError,
  } = useApiQuery<TiposDeRespuestaResponse>({
    url: '/tipos-contenido/getall/',
  })

  useEffect(() => {
    if (tiposRespuestaError) {
      toast.error('Error al cargar los Tipos de Respuesta', {
        description: 'Se usarán valores por defecto. Verifique su conexión.',
      })
    }
  }, [tiposRespuestaError])

  // * Hook para obtener las especialidades
  const {
    data: especialidadesData,
    isLoading: isLoadingEspecialidades,
    error: especialidadesError,
  } = useApiQuery<EspecialidadesResponse>({
    url: '/especialidades/getall/',
    queryKey: ['nespecialidades'],
  })

  useEffect(() => {
    if (especialidadesError) {
      toast.error('Error al cargar las Especialidades', {
        description: 'Se usarán valores por defecto. Verifique su conexión.',
      })
    }
  }, [especialidadesError])

  return {
    ordenServicioData,
    isLoadingOrdenServicio,
    ordenServicioError,
    tiposRespuestaData,
    isLoadingTiposRespuesta,
    tiposRespuestaError,
    especialidadesData,
    isLoadingEspecialidades,
    especialidadesError,
  }
}
