import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Eye, Edit } from 'lucide-react'
import type { UsuarioResponse } from './types'

export const getColumns = (navigate: (path: string) => void): ColumnDef<UsuarioResponse>[] => [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'username',
    header: 'Usuario',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'fullname',
    header: 'Nombre Completo',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'obra_principal_nombre',
    header: 'Obra Principal',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'rol_nombre',
    header: 'Rol',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'active',
    header: 'Estado',
    cell: info => (info.getValue() ? 'Activo' : 'Inactivo'),
  },
  {
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
          onClick={() => navigate(`/config/usuarios/form/${row.original.id}`)}
        >
          <Edit className='h-4 w-4' />
        </Button>
      </div>
    ),
  },
]
