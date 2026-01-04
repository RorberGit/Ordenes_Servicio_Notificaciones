import { Badge } from '@/components/ui/badge'
import dayjs from 'dayjs'
import type { HistorialType } from '../types'

interface HistoricosProps {
  historicos: HistorialType[]
}

export default function Historial({ historicos }: HistoricosProps) {
  const getClass = (type: string) => {
    switch (type) {
      case 'Creación':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
      case 'Modificación':
        return 'bg-blue-500 text-white dark:bg-blue-700 dark:text-blue-100 border-blue-600 dark:border-blue-800'
      case 'Eliminación':
        return 'bg-gray-700 text-white dark:bg-gray-900 dark:text-gray-400 border-gray-800 dark:border-gray-950'
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
    }
  }

  return (
    <div className='space-y-2 pt-4'>
      <h3 className='boder-b pb-2 text-xl font-semibold text-gray-900 dark:text-white'>
        Histórico
      </h3>
      <div className='grid grid-cols-7 gap-4 border-b pb-2 text-sm font-bold dark:text-gray-300'>
        <span className='col-span-1'>Estado</span>
        <span className='col-span-1'>Fecha</span>
        <span className='col-span-2'>Creado por</span>
      </div>
      {historicos.map(item => (
        <div
          key={item.id}
          className='grid grid-cols-7 items-start gap-4 border-b pb-2 last:border-b-0'
        >
          {/* Columna 1 */}
          {item?.history_type_display ? (
            <Badge
              variant={'outline'}
              className={`${getClass(item.history_type_display)} col-span-1`}
            >
              {item.history_type_display}
            </Badge>
          ) : (
            <p className='text-gray-500'>-</p>
          )}
          {/* Columna 2 */}
          <p className='col-span-1 items-center text-sm dark:text-gray-300'>
            {item.updated_at ? dayjs(item.updated_at).format('DD/MM/YYYY') : '-'}
          </p>
          {/* Columna 4 */}
          <p className='col-span-2 text-sm dark:text-gray-300'>
            {item.history_user_nombre ? item.history_user_nombre : '-'}
          </p>
        </div>
      ))}
    </div>
  )
}
