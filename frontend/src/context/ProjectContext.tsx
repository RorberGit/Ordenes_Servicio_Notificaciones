// src/context/ProjectContext.tsx

import React, { createContext, useContext, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext' // Para acceder a los proyectos disponibles

// -----------------------------------------------------
// Clave para localStorage del proyecto ACTIVO
const PROJECT_STORAGE_KEY = 'active_project_name'
// -----------------------------------------------------

interface ProjectContextType {
  activeProject: string | null
  setActiveProject: (projectName: string | null) => void
  // Opcional: lista de proyectos disponibles
  // availableProjects: string[];
}

// Inicializa el estado leyendo desde localStorage
const getInitialProject = (): string | null => {
  try {
    return localStorage.getItem(PROJECT_STORAGE_KEY)
  } catch (error) {
    console.error('Error al leer el proyecto activo:', error)
    return null
  }
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

interface ProjectProviderProps {
  children: ReactNode
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth() // Usamos AuthContext

  // Si el usuario está autenticado, inicializa con localStorage
  // Si no está autenticado, el proyecto activo debe ser null.
  const initialProject = isAuthenticated ? getInitialProject() : null

  const [activeProject, setActiveProjectState] = useState<string | null>(initialProject)

  // Función para manejar la selección y persistencia
  const setActiveProject = (projectName: string | null) => {
    setActiveProjectState(projectName)

    if (projectName) {
      localStorage.setItem(PROJECT_STORAGE_KEY, projectName)
    } else {
      localStorage.removeItem(PROJECT_STORAGE_KEY)
    }
  }

  // Lógica para RESETEAR el proyecto si el usuario se desloguea (opcional pero recomendado)
  React.useEffect(() => {
    if (!isAuthenticated) {
      setActiveProjectState(null)
      localStorage.removeItem(PROJECT_STORAGE_KEY)
    }
  }, [isAuthenticated])

  const contextValue: ProjectContextType = {
    activeProject,
    setActiveProject,
  }

  return <ProjectContext.Provider value={contextValue}>{children}</ProjectContext.Provider>
}

// Custom Hook para ProjectContext
export const useProject = () => {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error('useProject debe ser usado dentro de un ProjectProvider')
  }
  return context
}
