// src/components/ProtectedRoute.tsx (Versión Final y Completa)

import React, { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { type Role } from '../types/auth' // Importa el tipo Role

interface ProtectedRouteProps {
  children: ReactNode
  // Opcional: Array de roles que tienen permitido acceder
  allowedRoles?: Role[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth()

  // ------------------------------------
  // 1. CHEQUEO DE AUTENTICACIÓN
  // ------------------------------------
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  // ------------------------------------
  // 2. CHEQUEO DE AUTORIZACIÓN (Roles)
  // ------------------------------------
  if (allowedRoles && allowedRoles.length > 0) {
    // El usuario debe estar presente si isAuthenticated es true
    const userRoles = user!.roles

    // Verificamos si al menos uno de los roles del usuario está en allowedRoles
    const isAuthorized = allowedRoles.some(role => userRoles.includes(role))

    if (!isAuthorized) {
      // Si no está autorizado, puedes redirigir a una página de "Acceso Denegado" o a la página principal.
      // Usaremos una página de acceso denegado /unauthorized
      return <Navigate to='/unauthorized' replace />
    }
  }

  // Si pasa ambos chequeos (Autenticación y Autorización), renderiza la ruta
  return <>{children}</>
}
