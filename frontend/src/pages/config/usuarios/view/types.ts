export interface ObraPermitida {
  id: string
  nombre: string
  descripcion?: string
}

export interface Rol {
  id: string
  nombre: string
  descripcion?: string
}

export interface UsuarioResponse {
  id: number
  username: string
  fullname: string
  email: string
  obra_principal: string
  obra_principal_nombre: string
  active: boolean
  rol_nombre: string
  rol: string
  obras_permitidas: ObraPermitida[]
}

export interface UsuarioPayload {
  username: string
  fullname: string
  email: string
  obra_principal: string // ID de la obra principal
  active: boolean
  rol: string // ID del rol
  obras_permitidas: string[]
}
