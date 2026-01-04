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

export default function ViewTipoContenido() {
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const {
    data: tipoContenidoData,
    isLoading,
    error,
    refetch,
  } = useApiQuery<PaginatedResponse>({
    url: '/tipos-contenido/getall-paginated/',
    params: { page: currentPage },
  })

  // 👇 Este efecto detecta si se navegó con el flag refresh
  useEffect(() => {
    if (location.state?.refresh) {
      refetch()
    }
  }, [location.state, refetch])

  const {
    results: tipoContenido = [],
    pagination: { count = 0, next, previous, total_pages } = {},
  } = tipoContenidoData?.data || {}
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
                No se encontraron tipos de contenido
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
          <CardTitle>Error al cargar los tipos de contenido</CardTitle>
          <CardDescription>
            {(axiosError?.response?.data as { data?: { message?: string } })?.data?.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-red-600'>No se pudieron cargar los tipos de contenido.</p>
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
        titles='Tipos de Contenido'
        count={count}
        currentPage={currentPage}
        totalPages={totalPages}
        url='/config/tipo-contenido/new'
      />
      <CardContent>
        <DataTable columns={columns} data={tipoContenido} isLoading={isLoading} />

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
