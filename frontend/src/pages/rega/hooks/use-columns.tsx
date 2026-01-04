// use-columns.tsx

import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import type { Registro, TypeInput } from '../types'
import { HeaderFilter } from '../lib/HeaderFilter'
import { Button } from '@/components/ui/button'
import { Edit, View } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useQueryRega } from './use-QueryRega'
import { generateRegistroCode } from '../utils/resistro-utils'

export default function useColumns(
  filterInputs: TypeInput,
  handleColumnFilterChange: (key: string, value: string) => void,
) {
  const navigate = useNavigate()

  // 🧑🏻 Usuario actual del sistema
  const { user } = useAuth()

  // 🧑🏻 Obtener usuarios para permisos
  const { usuarioData } = useQueryRega()

  // 🔑 Id del usuario ------------------------------------------------------------
  const currentUserId = useMemo(() => {
    return usuarioData?.data?.find(u => u.username === user?.username)?.id
  }, [usuarioData, user])

  const TextColumnFilter = ({ id, placeholder }: { id: keyof TypeInput; placeholder: string }) => (
    <div className='flex flex-col gap-1 pb-1'>
      <span>{placeholder}</span>
      <HeaderFilter
        id={id}
        placeholder={`Buscar ${placeholder.toLowerCase()}`}
        initialValue={filterInputs[id] || ''}
        onFilterChange={handleColumnFilterChange}
      />
    </div>
  )

  const columns: ColumnDef<Registro>[] = useMemo(
    () => [
      {
        accessorKey: 'num',
        header: () => (
          <div className='flex flex-col gap-1 pb-1'>
            <span>Código</span>
            <div className='h-9' />
          </div>
        ),
        cell: ({ row }) => {
          return generateRegistroCode(row.original)
        },
      },

      // 🟢 DESCRIPCION (CORREGIDO)
      {
        accessorKey: 'descripcion',
        header: () => <TextColumnFilter id='descripcion' placeholder='Descripcion' />,
        cell: ({ row }) => <div className='max-w-xs truncate'>{row.getValue('descripcion')}</div>,
      },

      // 🟢 ENT/SAL (CORREGIDO)
      {
        accessorKey: 'ent_sal',
        header: () => <TextColumnFilter id='ent_sal' placeholder='Entra o Salida' />,
        cell: ({ row }) => <div>{row.getValue('ent_sal')}</div>,
      },

      // 🟢 PROCEDENCIA/DESTINO (CORREGIDO)
      {
        accessorKey: 'procedencia_destino',
        header: () => (
          <TextColumnFilter id='procedencia_destino' placeholder='Procedencia o Destino' />
        ),
        cell: ({ row }) => {
          const procedencia = row.getValue('procedencia_destino') as Registro['procedencia_destino']
          return procedencia ? `${procedencia.descripcion}` : '-'
        },
      },

      // 🟢 TIPO DOCUMENTO (CORREGIDO)
      {
        accessorKey: 'tipo_documento',
        header: () => <TextColumnFilter id='tipo_documento' placeholder='Tipo de documento' />,
        cell: ({ row }) => {
          const tipo = row.getValue('tipo_documento') as Registro['tipo_documento']
          return tipo ? `${tipo.descripcion}` : '-'
        },
      },

      {
        accessorKey: 'unidad',
        header: () => (
          <div className='flex flex-col gap-1 pb-1'>
            <span>Unidad</span>
            <div className='h-9' />
          </div>
        ),
        cell: ({ row }) => {
          const unidad = row.getValue('unidad') as Registro['unidad']
          return unidad ? `${unidad.descripcion}` : '-'
        },
      },

      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
          const registro = row.original
          const canEdit = user?.rol === 'Administrador' || registro.usuario?.id === currentUserId

          return (
            <div className='flex gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => navigate(`/rega/details/${registro.id}`)}
              >
                <View />
              </Button>

              {canEdit && (
                <Button
                  size='sm'
                  variant='default'
                  onClick={() => navigate(`/rega/form?id=${registro.id}`)}
                >
                  <Edit />
                </Button>
              )}
            </div>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUserId, navigate, user?.rol],
  )

  return columns
}
