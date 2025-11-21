import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
} from '@tanstack/react-table'
import { getColumns } from '../lib/columns'
import type { ServicesOrderResponse } from '../types'

interface PaginatedResponse {
  results: ServicesOrderResponse
  pagination: {
    count: number
    next: string | null
    previous: string | null
    current_page: number
    total_pages: number
  }
}

export default function ViewServiceOrders() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const estadoFilter = searchParams.get('estado_id')
  const filtroFilter = searchParams.get('filtro')
  const [currentPage, setCurrentPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const navigate = useNavigate()

  const params: Record<string, string | number> = { page: currentPage }
  if (estadoFilter) {
    params.estado_id = estadoFilter
  }
  if (filtroFilter) {
    params.filtro = filtroFilter
  }

  const {
    data: serviceOrdersData,
    isLoading,
    refetch,
  } = useApiQuery<PaginatedResponse>({
    url: '/ordenes/getall-paginated/',
    params,
  })

  // 👇 Este efecto detecta si se navegó con el flag refresh
  useEffect(() => {
    if (location.state?.refresh) {
      refetch()
    }
  }, [location.state, refetch])

  const {
    results: serviceOrders = [],
    pagination: { count = 0, next, previous, total_pages } = {},
  } = serviceOrdersData?.data || {}
  const totalPages = total_pages || 0

  const columns = getColumns(navigate)

  const table = useReactTable({
    data: serviceOrders,
    columns,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
  })

  if (isLoading) {
    return (
      <Card className='mx-auto max-w-6xl'>
        <CardHeader>
          <Skeleton className='h-8 w-64' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full' />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

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
            <Input
              placeholder='Buscar órdenes...'
              value={globalFilter ?? ''}
              onChange={event => setGlobalFilter(String(event.target.value))}
              className='max-w-sm'
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {serviceOrders.length === 0 ? (
          <p className='text-center text-gray-500'>No hay órdenes de servicio registradas.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                      No hay órdenes de servicio registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className='mt-4 flex items-center justify-between'>
              <Button
                variant='outline'
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!previous}
              >
                Anterior
              </Button>
              <span className='text-sm text-gray-600'>
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant='outline'
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!next}
              >
                Siguiente
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
