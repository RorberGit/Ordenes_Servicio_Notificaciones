import { useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import type { RegistroOne } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { API_BASE_URL } from '@/services/apiClient'
import DetailsUI from './components/ui-details'

export default function RegaDetails() {
  const { id } = useParams<{ id: string }>()

  const handleDownload = (registroId: string) => {
    // Simple GET call que activa la descarga
    window.location.href = `${API_BASE_URL}/registros/download/${registroId}/`
  }

  const {
    data: regaData,
    isLoading,
    error,
    refetch,
  } = useApiQuery<RegistroOne>({
    url: `/registros/getone?id=${id}`,
    refetchOnMount: 'always',
  })

  const registro = regaData?.data

  if (isLoading) {
    return (
      <Card className='mx-auto w-[800px]'>
        <CardHeader>
          <Skeleton className='h-8 w-64' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-6 w-full' />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !registro) {
    return (
      <Card className='mx-auto w-[800px]'>
        <CardHeader>
          <CardTitle>Error al cargar los detalles del registro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-red-600'>No se pudieron cargar los detalles del registro.</p>
          <Button onClick={() => refetch()} className='mt-4'>
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return <DetailsUI registro={registro} handleDownload={handleDownload} id='id' />
}
