import type { Notification } from '../notifications/types'
import type { EspecialidadesResponse, HistoricosResponse } from '../types/types-comun'

interface ServiceOrder {
  id: string
  numero_orden: number
  asunto: string
  fecha_notificacion?: string
  notificacion_read?: Notification
  tipo_contenido_read: TipoContenido
  especialidad_read?: EspecialidadesResponse
  historicos?: HistoricosResponse
  proyecto_read: string
  estado_read?: string
  created_at: string
  updated_at: string
}

type ServicesOrderResponse = ServiceOrder[]

// Tipo para los datos que se envían al API
interface ServiceOrderPayload {
  asunto: string
  fecha_notificacion?: string
  notificacion?: string
  tipo_contenido: string
  especialidad?: string[]
  username: string | undefined
  estado?: number
  proyecto?: string | null
}

// Tipo para la data de los tipos de contenido desde la API
interface TipoContenido {
  id: string
  created_at: string
  updated_at: string
  nombre: string
  descripcion: string
}

// Tipo para la respuesta de tipos de contenido
type TiposContenidoResponse = TipoContenido[]

export type {
  ServiceOrder,
  ServicesOrderResponse,
  ServiceOrderPayload,
  TipoContenido,
  TiposContenidoResponse,
}
