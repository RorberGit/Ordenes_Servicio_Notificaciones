export interface ObraResponse {
  id: string
  nombre: string
  descripcion?: string
  created_at: string
}

export interface ObraPayload {
  nombre: string
  descripcion?: string
}
