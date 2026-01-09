// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, type ReactNode } from 'react'
import type { UserData, AuthContextType, Tokens, UserContext } from '../types/auth' // Importa tus tipos
import { authService } from '@/services/authService'
import { logger } from '@/lib/logger'

// Función para obtener los iniciales del usuario desde localStorage
const getInitialUser = (): UserContext | null => {
  try {
    const storedData = authService.getUser()
    if (storedData) return storedData
  } catch (error) {
    logger.error('Error al leer datos de localStorage:', error)
  }
  return null
}

// 1. Crea el Contexto con un valor inicial (null o valor predeterminado)
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 2. El Componente Provider
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserContext | null>(getInitialUser)
  const isAuthenticated = user !== null

  // Función para manejar el login (se llama después de la autenticación exitosa)
  const login = (userData: UserData, tokens: Tokens) => {
    const data: UserContext =
      userData.username === 'admin'
        ? {
            username: 'admin',
            fullname: 'Administrador',
            obra_principal: 'admin',
            email: 'admin@administracion.local',
            rol: 'Administrador',
            unidad: 'admin',
            obras_permitidas: ['admin'],
          }
        : {
            username: userData.username,
            fullname: userData.fullname,
            obra_principal: userData.obra_principal_nombre,
            email: userData.email,
            rol: userData.rol_nombre,
            unidad: userData.unidad.descripcion,
            obras_permitidas: userData.obras_permitidas?.map(obra => obra.nombre),
          }

    setUser(data)
    // Almacenar tokens
    authService.setTokens(tokens.access_token, tokens.refresh_token)
    // 2. Almacena los datos en localStorage
    authService.setUser(data)
  }

  // Función para manejar el logout
  const logout = () => {
    setUser(null)
    // 3. Limpia localStorage
    authService.clear()
  }

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// 3. El Custom Hook para usar el Contexto (¡Mejor práctica!)
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
