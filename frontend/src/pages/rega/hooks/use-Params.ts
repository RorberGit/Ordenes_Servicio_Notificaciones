import { useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import type { ColumnFiltersState } from '@tanstack/react-table'

const allowedFilters = ['descripcion', 'ent_sal', 'procedencia_destino', 'tipo_documento', 'unidad']

export default function useParams(currentPage: number, columnFilters: ColumnFiltersState) {
  // 🧑🏻 Usuario actual del sistema
  const { user } = useAuth()

  // 📤 Construir params para backend -------------------------------------------------
  const params = useMemo(() => {
    const p: Record<string, string | number> = { page: currentPage }

    // Si es uno de los inputs de los filtros agregar
    columnFilters.forEach(f => {
      if (allowedFilters.includes(f.id)) p[f.id] = String(f.value)
    })

    if (user && user.rol !== 'Administrador' && user.unidad) {
      p.unidad = user.unidad
    }

    return p
  }, [currentPage, columnFilters, user])

  return params
}
