import { createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Eye, Edit } from 'lucide-react'
import type { UsuarioResponse } from './types'

const columnHelper = createColumnHelper<UsuarioResponse>()

export const getColumns = (navigate: (path: string) => void) => [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('username', {
    header: 'Usuario',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('fullname', {
    header: 'Nombre Completo',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('obra_principal_nombre', {
    header: 'Obra Principal',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('rol_nombre', {
    header: 'Rol',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('active', {
    header: 'Estado',
    cell: info => (info.getValue() ? 'Activo' : 'Inactivo'),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => (
      <div className='flex gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigate(`/config/usuarios/details/${row.original.id}`)}
        >
          <Eye className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => navigate(`/config/usuarios/edit/${row.original.id}`)}
        >
          <Edit className='h-4 w-4' />
        </Button>
      </div>
    ),
  }),
]
