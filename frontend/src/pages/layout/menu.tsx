import type { MenuItem } from './types'
import { PlusCircle, RefreshCw, View } from 'lucide-react'

export const menu: MenuItem[] = [
  {
    title: 'Inicio',
    url: '/',
    description: 'Ir inicio del sitio',
  },
  {
    title: 'Ordenes de sericio',
    url: '#',
    items: [
      {
        title: 'Nueva orden de servicio',
        description: 'Crear nuevo registro',
        url: '/serviceorder/new',
        icon: <PlusCircle size={32} color='#13186b' />,
      },
      {
        title: 'Actualizar orden de servicio',
        description: 'Actualizar registro existente',
        url: 'serviceorder/update',
        icon: <RefreshCw size={32} color='#F59E0B' />,
      },
      {
        title: 'Ver ordenes de servicio',
        description: 'Mostrar los registros existentes',
        url: 'serviceorder/view',
        icon: <View size={32} color='#FF5733' />,
      },
    ],
  },
  {
    title: 'Notificaciones',
    url: '#',
    items: [
      {
        title: 'Nueva notificación',
        description: 'Crear nuevo registro',
        url: 'notifications/new',
        icon: <PlusCircle size={32} color='#1f28e5' />,
      },
      {
        title: 'Actualizar notificación',
        description: 'Actualizar registro existente',
        url: 'notifications/update',
        icon: <RefreshCw size={32} color='#F59E0B' />,
      },
      {
        title: 'Ver notificaciones',
        description: 'Mostrar los registros existentes',
        url: 'notifications/view',
        icon: <View size={32} color='#FF5733' />,
      },
    ],
  },
]
