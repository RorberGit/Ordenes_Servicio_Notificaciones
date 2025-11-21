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
