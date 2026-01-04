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
        title: 'Ordenes de servicio',
        description: 'Mostrar los registros existentes',
        url: 'serviceorder/view',
        icon: <View size={32} color='#FF5733' />,
      },
      {
        title: 'Notificaciones',
        description: 'Mostrar los registros existentes',
        url: 'notifications/view',
        icon: <View size={32} color='#FF5733' />,
      },
      {
        title: 'REGA',
        description: 'Mostrar los registros REGA existentes',
        url: 'rega/view',
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
        title: 'Unidades',
        description: 'Gestionar unidades',
        url: 'config/unidad/view',
        icon: <View size={32} color='#FF5733' />,
      },
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
        description: 'Gestionar tipos de contenidos',
        url: 'config/tipo-contenido/view',
        icon: <View size={32} color='#FF5733' />,
      },
      {
        title: 'Tipo documento',
        description: 'Gestionar tipos de dodumentos',
        url: 'config/tipo-documento/view',
        icon: <View size={32} color='#FF5733' />,
      },
      {
        title: 'Procedencias o Destinos',
        description: 'Gestionar tipos de dodumentos',
        url: 'config/procedencia-destino/view',
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
