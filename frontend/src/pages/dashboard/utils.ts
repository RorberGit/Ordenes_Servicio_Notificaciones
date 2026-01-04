import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import type { ServicesOrderResponse, ServiceOrder } from '../services_order/types'
import type { NotificationsResponse, Notification } from '../notifications/types'
import type { ApiResponse } from '@/services/apiClient'

dayjs.extend(utc)

export const statistics = (
  serviceOrdersData: ApiResponse<ServicesOrderResponse> | undefined,
  notificationsData: ApiResponse<NotificationsResponse> | undefined,
) => {
  const orders = serviceOrdersData?.data || []
  const notifications = notificationsData?.data || []

  const calculateStatus = (fechaNotif: string | undefined) => {
    if (!fechaNotif) return null

    const notificationDate = dayjs(fechaNotif)

    const now = dayjs().utc(true)

    const diffDays = now.diff(notificationDate, 'day')

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
        calculateStatus(item.fecha_notificacion) === 'Vencida' && getEstado(item) === 'En Progreso',
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
}
