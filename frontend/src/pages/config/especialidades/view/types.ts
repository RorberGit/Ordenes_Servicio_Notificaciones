export interface EspecialidadResponse {
  id: number
  nombre: string
  descripcion?: string
  fecha_creacion: string
}

export interface EspecialidadPayload {
  nombre: string
  descripcion?: string
}
