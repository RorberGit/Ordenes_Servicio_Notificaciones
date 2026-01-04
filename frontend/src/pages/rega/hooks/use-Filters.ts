// use-filters.ts

import type { ColumnFiltersState } from '@tanstack/react-table'
import type { TypeInput } from '../types'
import { useCallback, useEffect, useState } from 'react'
import type { SetURLSearchParams } from 'react-router-dom'

const initialInputs = {
  procedencia_destino: '',
  ent_sal: '',
  tipo_documento: '',
  descripcion: '',
}

export function useFilters(searchParams: URLSearchParams, setSearchParams: SetURLSearchParams) {
  // 📃 'Páginas de Inicio
  const initialPage = Number(searchParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)

  // 🔎 Filtros de columnas (tanstack)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // ⌨ Inputs visibles en los filtros
  const [filterInputs, setFilterInputs] = useState<TypeInput>(initialInputs)

  // 📌 Cargar filtros desde la URL al iniciar
  useEffect(() => {
    // Solo ejecutar una vez al montar
    if (searchParams.size === 0) return

    const filters: ColumnFiltersState = []
    const keys = ['descripcion', 'ent_sal', 'procedencia_destino', 'tipo_documento'] as const

    keys.forEach(key => {
      const value = searchParams.get(key)
      if (value !== null) {
        filters.push({ id: key, value })
      }
    })

    if (filters.length > 0) {
      // Actualizar inputs visibles, solo la primera carga
      const newInputs = { ...initialInputs }
      filters.forEach(f => {
        newInputs[f.id as keyof TypeInput] = f.value as string
      })
      setFilterInputs(newInputs)
      setColumnFilters(filters)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- FILTROS ESCRITOS ---
  const handleColumnFilterChange = useCallback((key: string, value: string) => {
    // 1) Actualizar tanstack
    setColumnFilters(prev => {
      const idx = prev.findIndex(f => f.id === key)

      if (idx >= 0) {
        if (value) {
          const newFilters = [...prev]
          newFilters[idx] = { id: key, value }
          return newFilters
        }
        return prev.filter(f => f.id !== key)
      }

      return value ? [...prev, { id: key, value }] : prev
    })

    // 2) Actualizar input visible
    setFilterInputs(prev => ({ ...prev, [key]: value }))

    // 3) Reiniciar página
    setCurrentPage(1)
  }, [])

  // Modificar filtros si las columnas de filtros cambia
  useEffect(() => {
    const paramsURL = new URLSearchParams()
    paramsURL.append('page', String(1))
    columnFilters.forEach(item => paramsURL.append(item.id, String(item.value)))
    setSearchParams(paramsURL)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters])

  // 💱 Cambio de página → actualizar URL
  useEffect(() => {
    setSearchParams(prev => {
      const url = new URLSearchParams(prev)
      url.set('page', String(currentPage))
      return url
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  return {
    currentPage,
    filterInputs,
    columnFilters,
    setCurrentPage,
    handleColumnFilterChange,
  }
}
