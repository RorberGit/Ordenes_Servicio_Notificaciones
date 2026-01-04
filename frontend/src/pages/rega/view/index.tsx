// ViewRega.tsx

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import type { PaginatedResponse } from '../types'
import DataTableRega from '../components/data-table'
import PaginatedButton from '@/pages/components/paginated-button'
import { useFilters } from '../hooks/use-Filters'
import useColumns from '../hooks/use-columns'
import useParams from '../hooks/use-Params'

export default function ViewRega() {
  const location = useLocation()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()

  // 🔍 Poner filtros
  const { filterInputs, columnFilters, currentPage, setCurrentPage, handleColumnFilterChange } =
    useFilters(searchParams, setSearchParams)

  // 🗼 Defenición de columnas
  const columns = useColumns(filterInputs, handleColumnFilterChange)

  // 📤 Construir params para backend -------------------------------------------------
  const params = useParams(currentPage, columnFilters)

  // 📃 Datos desde el endpoin ---------------------------------------------------------
  const {
    data: regaData,
    isLoading,
    refetch,
  } = useApiQuery<PaginatedResponse>({
    queryKey: ['rega', currentPage, params],
    url: '/registros/getall-paginated',
    params: params,
  })

  // Refrescar si viene de editar/crear --------------------------------------------------
  useEffect(() => {
    if (location.state?.refresh) refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- RESULTADOS PAGINADOS -------------------------------------------------------------
  const { results: Data, pagination: { count = 0, next, previous, total_pages } = {} } =
    regaData?.data || {}
  const totalPages = total_pages || 0

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle>Registros REGA</CardTitle>
        <div className='flex items-center justify-between'>
          <div className='text-sm text-gray-600'>
            Total de registros: {count} | Página {currentPage} de {totalPages}
          </div>

          <Button onClick={() => navigate('/rega/form')}>Nuevo Registro</Button>
        </div>
      </CardHeader>

      <CardContent>
        <DataTableRega Data={Data} columns={columns} isLoading={isLoading} />
        <PaginatedButton
          currentPage={currentPage}
          previous={previous}
          next={next}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </CardContent>
    </Card>
  )
}
