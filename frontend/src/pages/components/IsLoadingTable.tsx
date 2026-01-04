import { TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  columns: number
}

export default function IsLoadingTable({ columns }: Props) {
  return [...Array(8)].map((_, i) => (
    <TableRow key={`skeleton-${i}`}>
      {[...Array(columns)].map((_, index) => (
        <TableCell key={index}>
          <Skeleton className='bg-muted/50 h-4 w-full rounded-md' />
        </TableCell>
      ))}
    </TableRow>
  ))
}
