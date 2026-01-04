import { useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import { useNavigate } from 'react-router-dom'
import type { ProcedenciaDestinoResponse } from '../view/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import dayjs from 'dayjs'

export default function ProcedenciaDestinoDetails() {
  const { id } = useParams<{ id: string }>()

  const navigate = useNavigate()

  const {
    data: procedenciadestinoData,
    isLoading,
    error,
    refetch,
  } = useApiQuery<ProcedenciaDestinoResponse>({
    url: `/procedencia-destino/getone?id=${id}`,
    refetchOnMount: 'always',
  })

  const procedenciadestino = procedenciadestinoData?.data

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

  if (error || !procedenciadestino) {
    return (
      <Card className='mx-auto w-[800px]'>
        <CardHeader>
          <CardTitle>Error al cargar los detalles de la procedencia o destino</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-red-600'>
            No se pudieron cargar los detalles de la procedencia o destino.
          </p>
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
              navigate('/config/procedencia-destino/view', {
                replace: true,
                state: { refresh: true },
              })
            }
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver
          </Button>
          <CardTitle>Detalles de la prodecent: {procedenciadestino.cod}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid grid-cols-1 gap-4'>
          {/* Nombre */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Código:</label>
            <p>{procedenciadestino.cod}</p>
          </div>
          {/* Descripción */}
          {procedenciadestino.descripcion && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Descripción:</label>
              <p>{procedenciadestino.descripcion}</p>
            </div>
          )}
          {/* Fecha de Creación */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Fecha de Creación:</label>
            <span>{dayjs(procedenciadestino.created_at).format('DD/MM/YYYY')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
