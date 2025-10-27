import type { MenuItem } from './types'
import { PlusCircle, View } from 'lucide-react'

export const menu: MenuItem[] = [
  {
    title: 'Inicio',
    url: '/',
    description: 'Ir inicio del sitio',
  },
  {
    title: 'Operaciones',
    url: '#',
    items: [
      {
        title: 'Nueva orden de servicio',
        description: 'Crear nuevo registro',
        url: '/serviceorder/new',
        icon: <PlusCircle size={32} color='#1f28e5' />,
      },
      {
        title: 'Nueva notificación',
        description: 'Crear nuevo registro',
        url: 'notifications/new',
        icon: <PlusCircle size={32} color='#1f28e5' />,
      },
      {
        title: 'Ver ordenes de servicio',
        description: 'Mostrar los registros existentes',
        url: 'serviceorder/view',
        icon: <View size={32} color='#FF5733' />,
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
