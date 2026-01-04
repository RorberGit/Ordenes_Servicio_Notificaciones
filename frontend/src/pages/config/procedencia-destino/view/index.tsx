import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import { useLocation, useNavigate } from 'react-router-dom'
import { getColumns } from './columns'
import type { PaginatedResponse } from './types'
import { logger } from '@/lib/logger'
import PaginatedButton from '@/pages/components/paginated-button'
import CardHeaderView from '@/pages/components/CardHeaderView'
import DataTable from '@/pages/components/data-table'

export default function ViewProcedenciaDestino() {
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const {
    data: procedenciadestinoData,
    isLoading,
    error,
    refetch,
  } = useApiQuery<PaginatedResponse>({
    url: '/procedencia-destino/getall-paginated/',
    params: { page: currentPage },
  })

  // 👇 Este efecto detecta si se navegó con el flag refresh
  useEffect(() => {
    if (location.state?.refresh) {
      refetch()
    }
  }, [location.state, refetch])

  const {
    results: procedenciadestino = [],
    pagination: { count = 0, next, previous, total_pages } = {},
  } = procedenciadestinoData?.data || {}
  const totalPages = total_pages || 0

  const columns = getColumns(navigate, refetch)

  if (error) {
    logger.error('Vista ProcedenciaDestinoes => ', error)
  }

  return (
    <Card className='mx-auto min-w-2xl'>
      <CardHeaderView
        titles='Procedencias / Destinos'
        count={count}
        currentPage={currentPage}
        totalPages={totalPages}
        url='/config/procedencia-destino/new'
      />
      <CardContent>
        <DataTable columns={columns} data={procedenciadestino} isLoading={isLoading} />

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
