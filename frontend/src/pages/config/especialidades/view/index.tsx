import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import { useLocation, useNavigate } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { AxiosError } from 'axios'
import { getColumns } from './columns'
import type { PaginatedResponse } from './types'
import PaginatedButton from '@/pages/components/paginated-button'
import CardHeaderView from '@/pages/components/CardHeaderView'
import DataTable from '@/pages/components/data-table'

export default function ViewEspecialidades() {
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const {
    data: especialidadesData,
    isLoading,
    error,
    refetch,
  } = useApiQuery<PaginatedResponse>({
    url: '/especialidades/getall-paginated/',
    params: { page: currentPage },
  })

  // 👇 Este efecto detecta si se navegó con el flag refresh
  useEffect(() => {
    if (location.state?.refresh) {
      refetch()
    }
  }, [location.state, refetch])

  const {
    results: especialidades = [],
    pagination: { count = 0, next, previous, total_pages } = {},
  } = especialidadesData?.data || {}
  const totalPages = total_pages || 0

  const columns = getColumns(navigate, refetch)

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
                No se encontraron especialidades
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
          <CardTitle>Error al cargar las especialidades</CardTitle>
          <CardDescription>
            {(axiosError?.response?.data as { data?: { message?: string } })?.data?.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-red-600'>No se pudieron cargar las especialidades.</p>
          <Button onClick={() => refetch()} className='mt-4'>
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='mx-auto min-w-3xl'>
      <CardHeaderView
        titles='Especialidades'
        count={count}
        currentPage={currentPage}
        totalPages={totalPages}
        url='/config/especialidades/new'
      />
      <CardContent>
        <DataTable columns={columns} data={especialidades} isLoading={isLoading} />

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
