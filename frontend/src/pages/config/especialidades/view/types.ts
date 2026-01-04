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

export interface PaginatedResponse {
  results: EspecialidadResponse[]
  pagination: {
    count: number
    next: string | null
    previous: string | null
    current_page: number
    total_pages: number
  }
}
