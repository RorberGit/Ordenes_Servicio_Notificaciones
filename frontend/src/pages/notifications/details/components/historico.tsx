import { getStatusBadgeClasses } from '@/pages/utils/status-class-utils'
import { Badge } from '@/components/ui/badge'
import type { HistoricosResponse } from '@/pages/types/types-comun'
import dayjs from 'dayjs'

interface HistoricosProps {
  historicos: HistoricosResponse
}

export default function HistoricosComp({ historicos }: HistoricosProps) {
  return (
    <div className='space-y-2 pt-4'>
      <h3 className='boder-b pb-2 text-xl font-semibold text-gray-900 dark:text-white'>
        Histórico de Notificaciones
      </h3>
      <div className='grid grid-cols-7 gap-4 border-b pb-2 text-sm font-bold dark:text-gray-300'>
        <span className='col-span-1'>Estado</span>
        <span className='col-span-1'>Fecha</span>
        <span className='col-span-3'>Detalle</span>
        <span className='col-span-2'>Creado por</span>
      </div>
      {historicos.map(item => (
        <div
          key={item.id}
          className='grid grid-cols-7 items-start gap-4 border-b pb-2 last:border-b-0'
        >
          {/* Columna 1 */}
          {item?.estado ? (
            <Badge
              variant={'outline'}
              className={`${getStatusBadgeClasses(item.estado)} col-span-1`}
            >
              {item.estado}
            </Badge>
          ) : (
            <p className='text-gray-500'>-</p>
          )}
          {/* Columna 2 */}
          <p className='col-span-1 items-center text-sm dark:text-gray-300'>
            {item.fecha ? dayjs(item.fecha).format('DD/MM/YYYY') : '-'}
          </p>
          {/* Columna 3 */}
          <p className='col-span-3 text-sm dark:text-gray-300'>
            {item.resumen ? item.resumen : '-'}
          </p>
          {/* Columna 4 */}
          <p className='col-span-2 text-sm dark:text-gray-300'>{item.user ? item.user : '-'}</p>
        </div>
      ))}
    </div>
  )
}
