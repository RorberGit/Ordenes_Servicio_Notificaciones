import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import type { PaginatedResponse } from '../types'
import PaginatedButton from '@/pages/components/paginated-button'
import { getColumns } from '../lib/columns'
import DataTable from '@/pages/components/data-table'

export default function ViewNotificaciones() {
  const location = useLocation()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = Number(searchParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)

  const params: Record<string, string | number> = { page: currentPage }

  const {
    data: notificacionesData,
    isLoading,
    refetch,
  } = useApiQuery<PaginatedResponse>({
    url: '/notificaciones/getall-paginated',
    params,
  })

  useEffect(() => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('page', String(currentPage))
      return newParams
    })
  }, [currentPage, setSearchParams])

  // 👇 Este efecto detecta si se navegó con el flag refresh
  useEffect(() => {
    if (location.state?.refresh) {
      refetch()
    }
  }, [location.state, refetch])

  const {
    results: notificaciones = [],
    pagination: { count = 0, next, previous, total_pages } = {},
  } = notificacionesData?.data || {}

  const totalPages = total_pages || 0

  const columns = getColumns(navigate)

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle>Notificaciones</CardTitle>
        <div className='flex items-center justify-between'>
          <div className='text-sm text-gray-600'>
            Total de registros: {count} | Página {currentPage} de {totalPages}
          </div>
          <div className='flex items-center gap-2'>
            <Button onClick={() => navigate('/notifications/new')}>Nueva Notificación</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={notificaciones} isLoading={isLoading} />
        {/* Pagination */}
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
