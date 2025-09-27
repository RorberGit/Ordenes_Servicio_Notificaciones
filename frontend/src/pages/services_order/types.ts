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

// Tipo para las especialidades desde la API
interface Especialidad {
  id: string
  created_at: string
  updated_at: string
  nombre: string
  descripcion: string
}

// Tipo para la respuesta de especialidades
type EspecialidadesResponse = Especialidad[]

export type {
  ServiceOrderResponse,
  ServiceOrderPayload,
  ApiError,
  TipoContenido,
  TiposContenidoResponse,
  Especialidad,
  EspecialidadesResponse,
}
