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
import DataTable from '@/pages/components/data-table'

export default function ViewUsuarios() {
  const location = useLocation()
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  const {
    data: usuariosData,
    isLoading,
    error,
    refetch,
  } = useApiQuery<PaginatedResponse>({
    url: '/usuarios/users/getall-paginated/',
    params: { page: currentPage },
  })

  // 👇 Este efecto detecta si se navegó con el flag refresh
  useEffect(() => {
    if (location.state?.refresh) {
      refetch()
    }
  }, [location.state, refetch])

  const { results: usuarios = [], pagination: { count = 0, next, previous, total_pages } = {} } =
    usuariosData?.data || {}
  const totalPages = total_pages || 0

  const columns = getColumns(navigate)

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
              <CardDescription className='text-base'>No se encontraron usuarios</CardDescription>
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
          <CardTitle>Error al cargar los usuarios</CardTitle>
          <CardDescription>
            {(axiosError?.response?.data as { data?: { message?: string } })?.data?.message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-red-600'>No se pudieron cargar los usuarios.</p>
          <Button onClick={() => refetch()} className='mt-4'>
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='mx-auto min-w-6xl'>
      <CardHeader>
        <CardTitle>Usuarios</CardTitle>
        <div className='flex items-center justify-between'>
          <div className='text-sm text-gray-600'>
            Total de registros: {count} | Página {currentPage} de {totalPages}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={usuarios} isLoading={isLoading} />

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
