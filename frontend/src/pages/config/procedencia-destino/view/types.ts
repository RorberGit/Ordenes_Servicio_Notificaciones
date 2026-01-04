export interface ProcedenciaDestinoResponse {
  id: string
  cod: string
  descripcion?: string
  created_at: string
}

export interface ProcedenciaDestinoPayload {
  cod: string
  descripcion?: string
}

export interface PaginatedResponse {
  results: ProcedenciaDestinoResponse[]
  pagination: {
    count: number
    next: string | null
    previous: string | null
    current_page: number
    total_pages: number
  }
}
