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
      {
        title: 'Cambiar Obra',
        description: 'Seleccionar obra activa',
        url: 'work/select',
        icon: <PlusCircle size={32} color='#28a745' />,
      },
    ],
  },
  {
    title: 'Configuración',
    url: '#',
    items: [
      {
        title: 'Obra',
        description: 'Gestionar obras',
        url: 'config/obra/view',
        icon: <View size={32} color='#FF5733' />,
      },
      {
        title: 'Especialidades',
        description: 'Gestionar especialidades',
        url: 'config/especialidades/view',
        icon: <View size={32} color='#FF5733' />,
      },
      {
        title: 'Tipo Contenido',
        description: 'Gestionar tipos de contenido',
        url: 'config/tipo-contenido/view',
        icon: <View size={32} color='#FF5733' />,
      },
      {
        title: 'Usuarios',
        description: 'Ver usuarios',
        url: 'config/usuarios/view',
        icon: <View size={32} color='#FF5733' />,
      },
    ],
  },
]
