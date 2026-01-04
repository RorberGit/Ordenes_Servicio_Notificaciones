export type Role = 'Administrador' | 'A.Juridico' | 'Especialistas' | string

export interface Tokens {
  access_token: string
  refresh_token: string
}

export interface ObraPermitida {
  permisos_id: string
  obra_nombre: string
  tipo_permiso: 'lectura' | 'escritura'
}

interface Unidad {
  cod: string
  descripcion: string
}

export interface UserContext {
  username: string
  fullname: string
  obra_principal: string
  email: string
  rol: string
  obras_permitidas?: string[]
  unidad?: string
}
export interface UserData {
  username: string
  fullname: string
  obra_principal_nombre: string
  email: string
  rol_nombre: Role
  unidad: Unidad
  obras_permitidas?: {
    id: string
    created_at: string
    updated_at: string
    nombre: string
    descripcion: string
  }[]
}

export interface AuthContextType {
  user: UserContext | null
  isAuthenticated: boolean
  login: (userData: UserData, Tokens: Tokens) => void
  logout: () => void
}
