import { Badge } from '@/components/ui/badge'
import { getStatusBadgeClasses } from '@/pages/utils/status-class-utils'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

interface TiempoTranscurridoProps {
  fecha_notificacion?: string
}

export default function TiempoTranscurrido({ fecha_notificacion }: TiempoTranscurridoProps) {
  const notificationDate = dayjs(fecha_notificacion)
  const now = dayjs()

  const diffDays = now.diff(notificationDate, 'day')
  const BadgeClass = diffDays < 10 ? (diffDays >= 7 ? 'Casi Vencida' : 'default') : 'Vencida'

  return (
    <div className='flex flex-row items-center gap-4'>
      <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
        Tiempo Transcurrido:
      </label>
      <Badge
        variant='outline'
        className={`${getStatusBadgeClasses(BadgeClass)} text-sm font-semibold`}
      >
        {`${diffDays} días ${BadgeClass != 'default' ? BadgeClass : ''}`}
      </Badge>
    </div>
  )
}
