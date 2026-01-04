export interface TipoDocumentoResponse {
  id: string
  cod: string
  descripcion?: string
  created_at: string
}

export interface TipoDocumentoPayload {
  cod: string
  descripcion?: string
}

export interface PaginatedResponse {
  results: TipoDocumentoResponse[]
  pagination: {
    count: number
    next: string | null
    previous: string | null
    current_page: number
    total_pages: number
  }
}
