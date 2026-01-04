export interface TipoContenidoResponse {
  id: number
  nombre: string
  descripcion?: string
  fecha_creacion: string
}

export interface TipoContenidoPayload {
  nombre: string
  descripcion?: string
}

export interface PaginatedResponse {
  results: TipoContenidoResponse[]
  pagination: {
    count: number
    next: string | null
    previous: string | null
    current_page: number
    total_pages: number
  }
}
