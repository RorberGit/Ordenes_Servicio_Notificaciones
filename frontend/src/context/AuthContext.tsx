// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, type ReactNode } from 'react'
import type { UserData, AuthContextType } from '../types/auth' // Importa tus tipos

// -----------------------------------------------------
// Clave para localStorage
const LOCAL_STORAGE_KEY = 'auth_user_data'
// -----------------------------------------------------

// Función para obtener los datos iniciales del usuario desde localStorage
const getInitialUser = (): UserData | null => {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedData) {
      // Si hay datos, los parseamos y los retornamos
      return JSON.parse(storedData) as UserData
    }
  } catch (error) {
    console.error('Error al leer datos de localStorage:', error)
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
  const [user, setUser] = useState<UserData | null>(getInitialUser)
  const isAuthenticated = user !== null

  // Función para manejar el login (se llama después de la autenticación exitosa)
  const login = (data: UserData) => {
    setUser(data)
    // 2. Almacena los datos en localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  }

  // Función para manejar el logout
  const logout = () => {
    setUser(null)
    // 3. Limpia localStorage
    localStorage.removeItem(LOCAL_STORAGE_KEY)
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
