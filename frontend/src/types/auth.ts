export type Role = 'Administrador' | 'Editor' | 'Lector' | string

export interface UserData {
  userName: string
  fullName: string
  projectName: string
  roles: Role[]
}

export interface AuthContextType {
  user: UserData | null
  isAuthenticated: boolean
  login: (data: UserData) => void
  logout: () => void
}
