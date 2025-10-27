import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useLocation, useNavigate } from 'react-router-dom'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
} from '@tanstack/react-table'
import { FileQuestion } from 'lucide-react'
import { AxiosError } from 'axios'
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
  const [currentPage, setCurrentPage] = useState(1)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const navigate = useNavigate()

  const {
    data: serviceOrdersData,
    isLoading,
    error,
    refetch,
  } = useApiQuery<PaginatedResponse>({
    url: '/ordenes/getall-paginated/',
    params: { page: currentPage },
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

  if (error) {
    const axiosError = error as AxiosError
    const is404 = axiosError?.response?.status === 404
    if (is404) {
      return (
        <div className='bg-background flex min-h-screen items-center justify-center p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader className='text-center'>
              <div className='mb-4 flex justify-center'>
                <FileQuestion className='text-muted-foreground h-16 w-16' />
              </div>
              <CardTitle className='text-primary text-6xl font-extrabold'>404</CardTitle>
              <CardDescription className='text-base'>
                No se encontraron órdenes de servicio
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-muted-foreground text-center'>No existen registros que mostrar.</p>
              <div className='flex justify-center'>
                <Button onClick={() => refetch()} variant='outline' className='w-full'>
                  Reintentar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
    return (
      <Card className='mx-auto max-w-6xl'>
        <CardHeader>
          <CardTitle>Error al cargar las órdenes de servicio</CardTitle>
          <CardDescription>
            {(axiosError?.response?.data as { data?: { message?: string } })?.data?.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-red-600'>No se pudieron cargar las órdenes de servicio.</p>
          <Button onClick={() => refetch()} className='mt-4'>
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='mx-auto max-w-6xl'>
      <CardHeader>
        <CardTitle>Órdenes de Servicio</CardTitle>
        <div className='flex items-center justify-between'>
          <div className='text-sm text-gray-600'>
            Total de registros: {count} | Página {currentPage} de {totalPages}
          </div>
          <Input
            placeholder='Buscar órdenes...'
            value={globalFilter ?? ''}
            onChange={event => setGlobalFilter(String(event.target.value))}
            className='max-w-sm'
          />
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
