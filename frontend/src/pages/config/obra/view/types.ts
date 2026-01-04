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

export interface PaginatedResponse {
  results: ObraResponse[]
  pagination: {
    count: number
    next: string | null
    previous: string | null
    current_page: number
    total_pages: number
  }
}
