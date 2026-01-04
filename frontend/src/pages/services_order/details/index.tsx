import { useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import { useNavigate } from 'react-router-dom'
import type { ServiceOrder } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import ButtonEjecutar from './components/button-ejecutar'
import HistoricosComp from './components/historico'
import { Badge } from '@/components/ui/badge'
import ButtonCompletar from './components/button-completar'
import ButtonCancelar from './components/button-cancelar'
import TiempoTrascurrido from './components/tiempo-trascurrido'
import dayjs from 'dayjs'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'

export default function ServiceOrderDetails() {
  const { id } = useParams<{ id: string }>()

  const navigate = useNavigate()

  const [currentUserId, setCurrentUserId] = useState('')
  const { user } = useAuth()

  const {
    data: serviceOrderData,
    isLoading,
    error,
    refetch,
  } = useApiQuery<ServiceOrder>({
    url: `/ordenes/getone?id=${id}`,
    refetchOnMount: 'always',
  })

  interface Usuario {
    id: string
    username: string
    fullname: string
  }

  // * API Usuarios
  const { data: usuarioData } = useApiQuery<Usuario[]>({
    url: '/usuarios/users/',
    queryKey: ['usuarios'],
  })

  // Poner el usuario actual desde el context
  useEffect(() => {
    if (user && usuarioData?.data) {
      const currentUser = usuarioData.data.find(u => u.username === user.username)
      if (currentUser) {
        setCurrentUserId(`${currentUser.fullname} (${currentUser.username})`)
      }
    }
  }, [user, usuarioData])

  // Datos de las ordenes de servicio
  const serviceOrder = serviceOrderData?.data

  // * Constante para el control del Historico
  const historicos = serviceOrder?.historicos ?? []

  // Encontrar el user_id del creador (estado_id == 1)
  const creatorUserId = historicos.find(h => h.estado === 'Creada')?.user

  // Verificar si el usuario puede completar
  const canComplete = user?.rol === 'A.Juridico' || currentUserId === creatorUserId

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

  if (error || !serviceOrder) {
    return (
      <Card className='mx-auto w-[800px]'>
        <CardHeader>
          <CardTitle>Error al cargar los detalles de la orden de servicio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-red-600'>
            No se pudieron cargar los detalles de la orden de servicio.
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
              navigate('/serviceorder/view', { replace: true, state: { refresh: true } })
            }
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver
          </Button>
          <CardTitle>Detalles de la Orden de Servicio # {serviceOrder.numero_orden}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Tiempo transcurrido desde la Fecha notificación */}
        {serviceOrder?.fecha_notificacion && (
          <TiempoTrascurrido
            fecha_notificacion={serviceOrder.fecha_notificacion}
            estado_nombre={serviceOrder.estado_nombre}
          />
        )}
        <div className='grid grid-cols-1 gap-4'>
          {/* Número de Orden */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Número de Orden:</label>
            <p className='text-lg font-semibold'>{serviceOrder.numero_orden}</p>
          </div>
          {/* Asunto */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Asunto</label>
            <p>{serviceOrder.asunto}</p>
          </div>
          {/* Fecha de notificación */}
          {serviceOrder?.fecha_notificacion && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Fecha de Notificación</label>
              <span>{dayjs(serviceOrder.fecha_notificacion).format('DD/MM/YYYY')}</span>
            </div>
          )}
          {/* Notificación que responde Id - Nombre */}
          {serviceOrder?.notificacion_id_nombre && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Notificación:</label>
              <p>{serviceOrder?.notificacion_id_nombre}</p>
            </div>
          )}
          {/* Tipo de contenido */}
          {serviceOrder?.tipo_contenido_nombre && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Tipo de Contenido:</label>
              <p>{serviceOrder?.tipo_contenido_nombre}</p>
            </div>
          )}
          {/* Especialidades */}
          {serviceOrder?.especialidades && serviceOrder?.especialidades.length > 0 && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Especialidades:</label>
              <div className='flex flex-wrap items-center gap-2'>
                {serviceOrder?.especialidades.map((esp, index) => (
                  <Badge key={index} variant='outline' className='text-sm'>
                    {esp.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {/* Obra */}
          {serviceOrder?.obra_nombre && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Obra:</label>
              <span>{serviceOrder?.obra_nombre}</span>
            </div>
          )}
        </div>
        <div className='flex justify-end gap-4'>
          {serviceOrder?.estado_nombre === 'Creada' && user?.rol === 'A.Juridico' && (
            <ButtonEjecutar id={id} refetch={refetch} />
          )}
          {serviceOrder?.estado_nombre === 'En Progreso' && canComplete && (
            <ButtonCompletar id={id} refetch={refetch} />
          )}
          {serviceOrder.estado_nombre !== 'Completada' &&
            serviceOrder.estado_nombre !== 'Cancelada' &&
            canComplete && <ButtonCancelar id={id} refetch={refetch} />}
        </div>
        {/* Componente historico */}
        <HistoricosComp historicos={historicos} />
      </CardContent>
    </Card>
  )
}
