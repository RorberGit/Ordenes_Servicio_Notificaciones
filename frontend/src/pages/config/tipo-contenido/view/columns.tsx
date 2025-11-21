import { createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Eye, Edit } from 'lucide-react'
import type { TipoContenidoResponse } from './types'
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import type { ApiResponse } from '@/services/apiClient'
import ButtonEliminar from '@/components/ButtonEliminar'

const columnHelper = createColumnHelper<TipoContenidoResponse>()

export const getColumns = (
  navigate: (path: string) => void,
  refetch: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      ApiResponse<{
        results: TipoContenidoResponse[]
        pagination: {
          count: number
          next: string | null
          previous: string | null
          current_page: number
          total_pages: number
        }
      }>,
      Error
    >
  >,
) => [
  columnHelper.accessor('nombre', {
    header: 'Nombre',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('descripcion', {
    header: 'Descripción',
    cell: info => info.getValue() || 'Sin descripción',
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => (
      <div className='flex gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigate(`/config/tipo-contenido/details/${row.original.id}`)}
        >
          <Eye className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigate(`/config/tipo-contenido/new?id=${row.original.id}`)}
        >
          <Edit className='h-4 w-4' />
        </Button>
        <ButtonEliminar
          endpoint='/tipo-contenido/delete'
          id={row.original.id}
          nombre={row.original.nombre}
          refetch={refetch}
        />
      </div>
    ),
  }),
]
