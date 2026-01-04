import { useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import { useNavigate } from 'react-router-dom'
import type { TipoContenidoResponse } from '../view/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function TipoContenidoDetails() {
  const { id } = useParams<{ id: string }>()

  const navigate = useNavigate()

  const {
    data: tipoContenidoData,
    isLoading,
    error,
    refetch,
  } = useApiQuery<TipoContenidoResponse>({
    url: `/tipos-contenido/getone?id=${id}`,
    refetchOnMount: 'always',
  })

  const tipoContenido = tipoContenidoData?.data

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

  if (error || !tipoContenido) {
    return (
      <Card className='mx-auto w-[800px]'>
        <CardHeader>
          <CardTitle>Error al cargar los detalles del tipo de contenido</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-red-600'>No se pudieron cargar los detalles del tipo de contenido.</p>
          <Button onClick={() => refetch()} className='mt-4'>
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  const ClassDiv = 'flex flex-row items-center gap-4'
  const ClassLabel = 'text-sm font-medium text-gray-700 dark:text-gray-300'

  return (
    <Card className='mx-auto w-[800px]'>
      <CardHeader>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              navigate('/config/tipo-contenido/view', { replace: true, state: { refresh: true } })
            }
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver
          </Button>
          <CardTitle>Detalles del Tipo de Contenido: {tipoContenido.nombre}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid grid-cols-1 gap-4'>
          {/* Nombre */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Nombre:</label>
            <p>{tipoContenido.nombre}</p>
          </div>
          {/* Descripción */}
          {tipoContenido.descripcion && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Descripción:</label>
              <p>{tipoContenido.descripcion}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
