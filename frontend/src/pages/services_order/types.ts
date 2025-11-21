import type { EspecialidadesResponse, HistoricosResponse } from '../types/types-comun'

interface ServiceOrder {
  id: string
  numero_orden: number
  asunto: string
  fecha_notificacion?: string
  notificacion_id_nombre?: string
  tipo_contenido_nombre: string
  especialidades?: EspecialidadesResponse
  historicos?: HistoricosResponse
  obra_nombre: string
  estado_nombre?: string
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
  obra?: string | null
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
