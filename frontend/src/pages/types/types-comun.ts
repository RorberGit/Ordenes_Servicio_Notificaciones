// Tipo para la respuesta del API
type Estado_valor =
  | 'Creada'
  | 'En Progreso'
  | 'Casi Vencida'
  | 'Vencida'
  | 'Completada'
  | 'Cancelada'

interface Historicos {
  estado?: Estado_valor
  estado_id?: number
  fecha?: string
  id?: string
  resumen: string
  user: string
  user_id?: string
}

type HistoricosResponse = Historicos[]

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

// Tipo para errores de la API
interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

export type { Historicos, HistoricosResponse, Especialidad, EspecialidadesResponse, ApiError }
