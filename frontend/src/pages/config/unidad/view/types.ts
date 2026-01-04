export interface UnidadResponse {
  id: string
  cod: string
  descripcion?: string
  created_at: string
}

export interface UnidadPayload {
  cod: string
  descripcion?: string
}

export interface PaginatedResponse {
  results: UnidadResponse[]
  pagination: {
    count: number
    next: string | null
    previous: string | null
    current_page: number
    total_pages: number
  }
}
