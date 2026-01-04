import type { EspecialidadesResponse, HistoricosResponse } from '../types/types-comun'

// Tipo para la respuesta del API de notificaciones
interface Notification {
  id: string
  numero_notificacion: number
  asunto: string
  fecha_notificacion: string
  lleva_respuesta?: boolean
  especialidad_read?: EspecialidadesResponse
  obra_read: string
  numero_orden_respuesta_read?: string
  tipo_respuesta_read?: TipoDeRespuesta
  historicos?: HistoricosResponse
  estado_read?: string
}

type NotificationsResponse = Notification[]

// Tipo para los datos que se envían al API
interface NotificationPayload {
  numero_notificacion: number
  asunto?: string
  fecha_notificacion?: string
  lleva_respuesta?: boolean
  especialidad?: string[]
  numero_orden_respuesta?: string
  tipo_respuesta?: string
  username: string | undefined
  estado?: number | undefined
  obra?: string | null
}

// Tipo para los tipos de respuesta desde la API
interface TipoDeRespuesta {
  id: string
  created_at: string
  updated_at: string
  nombre: string
  descripcion: string
}

// Tipo para la respuesta de tipos de respuesta
type TiposDeRespuestaResponse = TipoDeRespuesta[]

interface PaginatedResponse {
  results: NotificationsResponse
  pagination: {
    count: number
    next: string | null
    previous: string | null
    current_page: number
    total_pages: number
  }
}

export const defaultValues = {
  numero_notificacion: undefined,
  asunto: '',
  lleva_respuesta: false,
  numero_orden_respuesta: '',
  especialidad: [],
  tipo_respuesta: '',
}

export type {
  Notification,
  NotificationsResponse,
  NotificationPayload,
  TipoDeRespuesta,
  TiposDeRespuestaResponse,
  PaginatedResponse,
}
