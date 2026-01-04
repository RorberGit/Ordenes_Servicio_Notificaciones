// data-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Registro, RegistrosResponse } from '../types'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import IsLoadingTable from '@/pages/components/IsLoadingTable'

interface DataTableProps {
  Data: RegistrosResponse | undefined
  columns: ColumnDef<Registro>[]
  isLoading: boolean
}

export default function DataTableRega({ Data, columns, isLoading }: DataTableProps) {
  // 📋 Recrear la tabla -------------------------------------------------------------------
  const table = useReactTable({
    data: Data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          // Skeleton integrado
          <IsLoadingTable columns={columns.length} />
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map(row => (
            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className='h-24 text-center'>
              No hay registros para mostrar.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
