// src/context/WorkContext.tsx

import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext' // Para acceder a los obras disponibles
import { logger } from '@/lib/logger'

// -----------------------------------------------------
// Clave para localStorage del obra ACTIVO
export const WORK_STORAGE_KEY = 'active_work_name'
// -----------------------------------------------------

interface WorkContextType {
  activeWork: string | null
  setActiveWork: (workName: string | null) => void
  // Opcional: lista de obras disponibles
  // availableWorks: string[];
}

// Inicializa el estado leyendo desde localStorage
const getInitialWork = (): string | null => {
  try {
    return localStorage.getItem(WORK_STORAGE_KEY)
  } catch (error) {
    logger.error('Error al leer el obra activa:', error)
    return null
  }
}

const WorkContext = createContext<WorkContextType | undefined>(undefined)

interface WorkProviderProps {
  children: ReactNode
}

export const WorkProvider: React.FC<WorkProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth() // Usamos AuthContext

  // Si el usuario está autenticado, inicializa con localStorage
  // Si no está autenticado, el obra activa debe ser null.
  const initialWork = isAuthenticated ? getInitialWork() : null

  const [activeWork, setActiveWorkState] = useState<string | null>(initialWork)

  // Función para manejar la selección y persistencia
  const setActiveWork = (workName: string | null) => {
    setActiveWorkState(workName)

    if (workName) {
      localStorage.setItem(WORK_STORAGE_KEY, workName)
    } else {
      localStorage.removeItem(WORK_STORAGE_KEY)
    }
  }

  // Lógica para RESETEAR el obra si el usuario se desloguea (opcional pero recomendado)
  React.useEffect(() => {
    if (!isAuthenticated) {
      setActiveWorkState(null)
      localStorage.removeItem(WORK_STORAGE_KEY)
    }
  }, [isAuthenticated])

  // Lógica para inicializar la obra principal del usuario cuando se autentica
  React.useEffect(() => {
    if (isAuthenticated && user && !activeWork) {
      // Si el usuario está autenticado, tiene obra_principal y no hay obra activa, setearla
      setActiveWork(user.obra_principal)
    }
  }, [isAuthenticated, user, activeWork])

  const contextValue: WorkContextType = {
    activeWork,
    setActiveWork,
  }

  return <WorkContext.Provider value={contextValue}>{children}</WorkContext.Provider>
}

// Custom Hook para WorkContext
export const useWork = () => {
  const context = useContext(WorkContext)
  if (context === undefined) {
    throw new Error('useWork debe ser usado dentro de un WorkProvider')
  }
  return context
}
