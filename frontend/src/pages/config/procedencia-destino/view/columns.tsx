import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Eye, Edit } from 'lucide-react'
import type { PaginatedResponse, ProcedenciaDestinoResponse } from './types'
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import type { ApiResponse } from '@/services/apiClient'
import ButtonEliminar from '@/components/ButtonEliminar'

export const getColumns = (
  navigate: (path: string) => void,
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<ApiResponse<PaginatedResponse>, Error>>,
): ColumnDef<ProcedenciaDestinoResponse>[] => [
  {
    accessorKey: 'cod',
    header: 'Código',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'descripcion',
    header: 'Descripción',
    cell: info => info.getValue() || 'Sin descripción',
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => (
      <div className='flex gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigate(`/config/procedencia-destino/details/${row.original.id}`)}
        >
          <Eye className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigate(`/config/procedencia-destino/new?id=${row.original.id}`)}
        >
          <Edit className='h-4 w-4' />
        </Button>
        <ButtonEliminar
          endpoint='/procedencia-destino/delete'
          id={row.original.id}
          nombre={row.original.descripcion}
          refetch={refetch}
        />
      </div>
    ),
  },
]
