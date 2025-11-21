import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle, Clock, XCircle, Plus, Loader } from 'lucide-react'
import type { ServicesOrderResponse, ServiceOrder } from '../services_order/types'
import type { NotificationsResponse, Notification } from '../notifications/types'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

type StatsData = {
  creadas: number
  enProgreso: number
  proximasAVencer: number
  vencidas: number
  completadas: number
  canceladas: number
}

export default function DashBoard() {
  const navigate = useNavigate()

  // Obtener todas las órdenes de servicio
  const { data: serviceOrdersData, isLoading: isLoadingOrders } =
    useApiQuery<ServicesOrderResponse>({
      url: '/ordenes/getall/',
      queryKey: ['service-orders-dashboard'],
    })

  // Obtener todas las notificaciones
  const { data: notificationsData, isLoading: isLoadingNotifications } =
    useApiQuery<NotificationsResponse>({
      url: '/notificaciones/getall/',
      queryKey: ['notifications-dashboard'],
    })

  // Calcular estadísticas
  const stats = useMemo(() => {
    const orders = serviceOrdersData?.data || []
    const notifications = notificationsData?.data || []

    const calculateStatus = (fechaNotif: string | undefined) => {
      if (!fechaNotif) return null

      const notificationDate = dayjs(fechaNotif)

      const now = dayjs().utc(true)

      const diffDays = now.diff(notificationDate, 'day')

      console.log(`dias trascurridos ${diffDays} de fecha ${notificationDate} hoy ${now}`)

      if (diffDays > 10) return 'Vencida'
      if (diffDays >= 7) return 'Casi Vencida'
      return null
    }

    const getEstado = (item: ServiceOrder | Notification) =>
      (item as unknown as { estado_read?: string; estado_nombre?: string }).estado_read ||
      (item as unknown as { estado_read?: string; estado_nombre?: string }).estado_nombre ||
      ''

    const processItems = (items: (ServiceOrder | Notification)[]) => {
      const proximasAVencer = items.filter(
        item =>
          calculateStatus(item.fecha_notificacion) === 'Casi Vencida' &&
          getEstado(item) === 'En Progreso',
      ).length
      const vencidas = items.filter(
        item =>
          calculateStatus(item.fecha_notificacion) === 'Vencida' &&
          getEstado(item) === 'En Progreso',
      ).length
      const creadas = items.filter(item => getEstado(item) === 'Creada').length
      const enProgreso = items.filter(item => getEstado(item) === 'En Progreso').length
      const completadas = items.filter(item => getEstado(item) === 'Completada').length
      const canceladas = items.filter(item => getEstado(item) === 'Cancelada').length
      return { creadas, enProgreso, proximasAVencer, vencidas, completadas, canceladas }
    }

    const ordersStats = processItems(orders)
    const notificationsStats = processItems(notifications)

    return { ordersStats, notificationsStats }
  }, [serviceOrdersData, notificationsData])

  const isLoading = isLoadingOrders || isLoadingNotifications

  if (isLoading) {
    return (
      <div className='container mx-auto p-6'>
        <h1 className='mb-6 text-3xl font-bold'>Dashboard</h1>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className='animate-pulse'>
              <CardHeader>
                <div className='h-4 w-3/4 rounded bg-gray-200'></div>
                <div className='h-8 w-1/2 rounded bg-gray-200'></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderStatsSection = (title: string, statsData: StatsData, navigatePath: string) => (
    <div className='mb-8'>
      <h2 className='mb-4 text-2xl font-semibold'>{title}</h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
        {/* Creadas */}
        <Card className='transition-shadow hover:shadow-lg'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Creadas</CardTitle>
            <Plus className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-blue-600'>{statsData.creadas}</div>
            <p className='text-muted-foreground text-xs'>Nuevos registros</p>
            {statsData.creadas > 0 && (
              <Button
                variant='outline'
                size='sm'
                className='mt-2 w-full'
                onClick={() => navigate(`${navigatePath}?estado_id=1`)}
              >
                Ver Detalles
              </Button>
            )}
          </CardContent>
        </Card>

        {/* En Progreso */}
        <Card className='transition-shadow hover:shadow-lg'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>En Progreso</CardTitle>
            <Loader className='h-4 w-4 text-orange-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-orange-600'>{statsData.enProgreso}</div>
            <p className='text-muted-foreground text-xs'>Trabajos en ejecución</p>
            {statsData.enProgreso > 0 && (
              <Button
                variant='outline'
                size='sm'
                className='mt-2 w-full'
                onClick={() => navigate(`${navigatePath}?estado_id=2`)}
              >
                Ver Detalles
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Próximas a Vencerse */}
        <Card className='transition-shadow hover:shadow-lg'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Próximas a Vencerse</CardTitle>
            <Clock className='h-4 w-4 text-amber-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-amber-600'>{statsData.proximasAVencer}</div>
            <p className='text-muted-foreground text-xs'>Requieren atención inmediata</p>
            {statsData.proximasAVencer > 0 && (
              <Button
                variant='outline'
                size='sm'
                className='mt-2 w-full'
                onClick={() => navigate(`${navigatePath}?filtro=proximas&estado_id=2`)}
              >
                Ver Detalles
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Vencidas */}
        <Card className='transition-shadow hover:shadow-lg'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Vencidas</CardTitle>
            <AlertTriangle className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>{statsData.vencidas}</div>
            <p className='text-muted-foreground text-xs'>Acción requerida urgente</p>
            {statsData.vencidas > 0 && (
              <Button
                variant='outline'
                size='sm'
                className='mt-2 w-full'
                onClick={() => navigate(`${navigatePath}?filtro=vencidas&estado_id=2`)}
              >
                Ver Detalles
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Completadas */}
        <Card className='transition-shadow hover:shadow-lg'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Completadas</CardTitle>
            <CheckCircle className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>{statsData.completadas}</div>
            <p className='text-muted-foreground text-xs'>Trabajos finalizados</p>
            {statsData.completadas > 0 && (
              <Button
                variant='outline'
                size='sm'
                className='mt-2 w-full'
                onClick={() => navigate(`${navigatePath}?estado_id=5`)}
              >
                Ver Detalles
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Canceladas */}
        <Card className='transition-shadow hover:shadow-lg'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Canceladas</CardTitle>
            <XCircle className='h-4 w-4 text-gray-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-gray-600'>{statsData.canceladas}</div>
            <p className='text-muted-foreground text-xs'>Trabajos cancelados</p>
            {statsData.canceladas > 0 && (
              <Button
                variant='outline'
                size='sm'
                className='mt-2 w-full'
                onClick={() => navigate(`${navigatePath}?estado_id=6`)}
              >
                Ver Detalles
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className='container mx-auto grid grid-cols-2 space-x-4 p-6'>
      {renderStatsSection('Órdenes de Servicio', stats.ordersStats, '/serviceorder/view')}
      {renderStatsSection('Notificaciones', stats.notificationsStats, '/notifications/view')}
    </div>
  )
}
