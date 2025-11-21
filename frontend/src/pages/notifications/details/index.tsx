import { useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useNavigate } from 'react-router-dom'
import type { Notification } from '../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import ButtonEjecutar from './components/button-ejecutar'
import HistoricosComp from './components/historico'
import { Badge } from '@/components/ui/badge'
import ButtonCompletar from './components/button-completar'
import ButtonCancelar from './components/button-cancelar'
import { useMemo } from 'react'
import TiempoTranscurrido from '@/pages/components/tiempo-trascurrido'
import dayjs from 'dayjs'
import { useAuth } from '@/context/AuthContext'

export default function NotificationDetails() {
  const { id } = useParams<{ id: string }>()

  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    data: notificationData,
    isLoading,
    error,
    refetch,
  } = useApiQuery<Notification>({
    url: `/notificaciones/getone?id=${id}`,
  })

  const notification = notificationData?.data

  // * Constante para el control del Historico
  const historicos = useMemo(() => notification?.historicos ?? [], [notification?.historicos])

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

  if (error || !notification) {
    return (
      <Card className='mx-auto w-[800px]'>
        <CardHeader>
          <CardTitle>Error al cargar los detalles de la notificación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-red-600'>No se pudieron cargar los detalles de la notificación.</p>
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
              navigate('/notifications/view', { replace: true, state: { refresh: true } })
            }
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver
          </Button>
          <CardTitle>Detalles de la Notificación # {notification.numero_notificacion}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {notification?.fecha_notificacion && (
          <TiempoTranscurrido
            fecha_notificacion={notification.fecha_notificacion}
            estado={notification.estado_read}
          />
        )}
        <div className='grid grid-cols-1 gap-4'>
          {/* Número de notificación */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Número de Notificación:</label>
            <p className='text-lg font-semibold'>{notification.numero_notificacion}</p>
          </div>

          {/* Asunto */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Asunto:</label>
            <p>{notification.asunto}</p>
          </div>

          {/* Fecha de notificación en formato dd/mm/aaaa */}
          {notification?.fecha_notificacion && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Fecha de Notificación:</label>
              <span>{dayjs(notification.fecha_notificacion).format('DD/MM/YYYY')}</span>
            </div>
          )}

          {/* Lleva respuesta Si/No */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Lleva respuesta:</label>
            <p>{notification?.lleva_respuesta ? 'Si' : 'No'}</p>
          </div>

          {/* Númer de order de servicio que responde si existe */}
          {notification?.numero_orden_respuesta_read && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Número de order de servicio que responde:</label>
              <p>{notification?.numero_orden_respuesta_read}</p>
            </div>
          )}

          {/* Tipo de respuesta si existe */}
          {notification?.tipo_respuesta_read && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Tipo de respuesta:</label>
              <p>{notification?.tipo_respuesta_read?.nombre}</p>
            </div>
          )}

          {/* Especialidades si están definidas */}
          {notification?.especialidad_read && notification?.especialidad_read.length > 0 && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Especialidades:</label>
              <div className='flex flex-wrap items-center gap-2'>
                {notification?.especialidad_read.map((esp, index) => (
                  <Badge key={index} variant='outline' className='text-sm'>
                    {esp.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {notification?.obra_read && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Obra:</label>
              <span>{notification?.obra_read}</span>
            </div>
          )}
        </div>

        <div className='flex justify-end gap-4'>
          {notification?.estado_read === 'Creada' && user?.rol === 'A.Juridico' && (
            <ButtonEjecutar id={id} refetch={refetch} />
          )}
          {notification?.estado_read === 'En Progreso' && (
            <ButtonCompletar id={id} refetch={refetch} />
          )}
          {notification.estado_read !== 'Completada' &&
            notification.estado_read !== 'Cancelada' && (
              <ButtonCancelar id={id} refetch={refetch} />
            )}
        </div>
        {/* Componente historico */}
        <HistoricosComp historicos={historicos} />
      </CardContent>
    </Card>
  )
}
