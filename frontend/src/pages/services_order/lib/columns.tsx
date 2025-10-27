import { Button } from '@/components/ui/button'
import { type ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, ArrowUp, ArrowDown, View } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ServiceOrderResponse } from '../types'
import { getStatusBadgeClasses } from '@/pages/utils/status-class-utils'

export const getColumns = (navigate: (path: string) => void): ColumnDef<ServiceOrderResponse>[] => [
  {
    accessorKey: 'numero_orden',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-medium'
      >
        Número
        {column.getIsSorted() === 'asc' ? (
          <ArrowUp className='ml-2 h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown className='ml-2 h-4 w-4' />
        ) : (
          <ArrowUpDown className='ml-2 h-4 w-4' />
        )}
      </Button>
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('numero_orden')}</div>,
  },
  {
    accessorKey: 'asunto',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-medium'
      >
        Asunto
        {column.getIsSorted() === 'asc' ? (
          <ArrowUp className='ml-2 h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown className='ml-2 h-4 w-4' />
        ) : (
          <ArrowUpDown className='ml-2 h-4 w-4' />
        )}
      </Button>
    ),
    cell: ({ row }) => <div className='max-w-xs truncate'>{row.getValue('asunto')}</div>,
  },
  {
    accessorKey: 'tipo_contenido_read.nombre',
    header: 'Tipo de Contenido',
    cell: ({ row }) => {
      const tipoContenido = row.original.tipo_contenido_read
      return tipoContenido ? tipoContenido.nombre : '-'
    },
  },
  {
    accessorKey: 'fecha_notificacion',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-medium'
      >
        Fecha Notificación
        {column.getIsSorted() === 'asc' ? (
          <ArrowUp className='ml-2 h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown className='ml-2 h-4 w-4' />
        ) : (
          <ArrowUpDown className='ml-2 h-4 w-4' />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue('fecha_notificacion') as string
      return date ? new Date(date).toLocaleDateString('es-ES') : '-'
    },
  },
  {
    accessorKey: 'estado_read',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.getValue('estado_read') as string
      return (
        <Badge variant='outline' className={getStatusBadgeClasses(estado)}>
          {estado}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const order = row.original
      return (
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='default'
            onClick={() => navigate(`/serviceorder/details/${order.id}`)}
          >
            <View />
          </Button>
        </div>
      )
    },
  },
]
