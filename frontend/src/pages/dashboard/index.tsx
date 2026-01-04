import { useMemo } from 'react'
import { Card, CardHeader } from '@/components/ui/card'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import type { ServicesOrderResponse } from '../services_order/types'
import type { NotificationsResponse } from '../notifications/types'
import RenderStatsSection from './renderStatsSection'
import { statistics } from './utils'

export default function DashBoard() {
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
  const stats = useMemo(
    () => statistics(serviceOrdersData, notificationsData),
    [serviceOrdersData, notificationsData],
  )

  // Si loading es true
  const renderIsLoading = () => (
    <div className='container mx-auto p-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
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

  return (
    <div className='container mx-auto grid grid-cols-2 space-x-4 p-6'>
      {isLoadingOrders ? (
        renderIsLoading()
      ) : (
        <RenderStatsSection
          title='Órdenes de Servicio'
          statsData={stats.ordersStats}
          navigatePath='/serviceorder/view'
        />
      )}
      {isLoadingNotifications ? (
        renderIsLoading()
      ) : (
        <RenderStatsSection
          title='Notificaciones'
          statsData={stats.notificationsStats}
          navigatePath='/notifications/view'
        />
      )}
    </div>
  )
}
