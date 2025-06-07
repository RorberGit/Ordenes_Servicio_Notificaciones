import type { MenuItem } from './types'
import { Bell, ClipboardList, PlusCircle, RefreshCw, Trash2 } from 'lucide-react'

export const menu: MenuItem[] = [
  {
    title: 'Inicio',
    url: '#',
    description: 'Ir inicio del sitio',
  },
  {
    title: 'Ordenes de sericio',
    url: '#',
    items: [
      {
        title: 'Nueva orden de servicio',
        description: 'Crear nuevo registro',
        url: '#',
        icon: <PlusCircle size={32} color='#1f28e5' />,
      },
      {
        title: 'Actualizar orden de servicio',
        description: 'Actualizar registro existente',
        url: '#',
        icon: <RefreshCw size={32} color='#F59E0B' />,
      },
      {
        title: 'Eliminar orden de servicio',
        description: 'Eliminar el registro seleccionando',
        url: '#',
        icon: <Trash2 size={32} color='#FF5733' />,
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
        url: '#',
        icon: <PlusCircle size={32} color='#1f28e5' />,
      },
      {
        title: 'Actualizar notificación',
        description: 'Actualizar registro existente',
        url: '#',
        icon: <RefreshCw size={32} color='#F59E0B' />,
      },
      {
        title: 'Eliminar notificación',
        description: 'Eliminar el registro seleccionando',
        url: '#',
        icon: <Trash2 size={32} color='#FF5733' />,
      },
    ],
  },
]
