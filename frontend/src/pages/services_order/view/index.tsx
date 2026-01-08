import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import type { PaginatedResponse } from '../types'
import PaginatedButton from '@/pages/components/paginated-button'
import { getColumns } from '../lib/columns'
import DataTable from '@/pages/components/data-table'
import useParams from '../../hooks/use-params'

export default function ViewServiceOrders() {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const initialPage = Number(searchParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)

  const navigate = useNavigate()

  const params = useParams(currentPage)

  const {
    data: serviceOrdersData,
    isLoading,
    refetch,
  } = useApiQuery<PaginatedResponse>({
    url: '/ordenes/getall-paginated',
    params,
  })

  // 👇 Este efecto detecta si se navegó con el flag refresh
  useEffect(() => {
    if (location.state?.refresh) {
      refetch()
    }
  }, [location.state, refetch])

  // Desestruturar los datos del ENDPOIN
  const {
    results: serviceOrders = [],
    pagination: { count = 0, next, previous, total_pages } = {},
  } = serviceOrdersData?.data || {}
  const totalPages = total_pages || 0

  const columns = getColumns(navigate)

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle>Órdenes de Servicio</CardTitle>
        <div className='flex items-center justify-between'>
          <div className='text-sm text-gray-600'>
            Total de registros: {count} | Página {currentPage} de {totalPages}
          </div>
          <div className='flex items-center gap-2'>
            <Button onClick={() => navigate('/serviceorder/new')}>Nueva Orden de Servicio</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={serviceOrders} isLoading={isLoading} />
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
