import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, Clock, Loader, Plus, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  state: 'creadas' | 'enProgreso' | 'proximasAVencer' | 'vencidas' | 'completadas' | 'canceladas'
  statsCount: number
  url: string
}

export default function RenderCardStats({ state, statsCount, url }: Props) {
  const navigate = useNavigate()

  const part = {
    creadas: {
      icon: <Plus className='h-4 w-4 text-blue-500' />,
      title: 'Creadas',
      detail: 'Nuevos registros',
      textColor: 'text-blue-600',
      params: 'estado_id=1',
    },
    enProgreso: {
      icon: <Loader className='h-4 w-4 text-orange-500' />,
      title: 'En Progreso',
      detail: 'Trabajos en ejecución',
      textColor: 'text-orange-600',
      params: 'estado_id=2',
    },
    proximasAVencer: {
      icon: <Clock className='h-4 w-4 text-amber-500' />,
      title: 'Próximas a Vencerse',
      detail: 'Requieren atención inmediata',
      textColor: 'text-amber-600',
      params: 'filtro=proximas&estado_id=2',
    },
    vencidas: {
      icon: <AlertTriangle className='h-4 w-4 text-red-500' />,
      title: 'Vencidas',
      detail: 'Acción requerida urgente',
      textColor: 'text-red-600',
      params: 'filtro=vencidas&estado_id=2',
    },
    completadas: {
      icon: <CheckCircle className='h-4 w-4 text-green-500' />,
      title: 'Completadas',
      detail: 'Trabajos finalizados',
      textColor: 'text-green-600',
      params: 'estado_id=5',
    },
    canceladas: {
      icon: <XCircle className='h-4 w-4 text-gray-500' />,
      title: 'Canceladas',
      detail: 'Trabajos cancelados',
      textColor: 'text-gray-600',
      params: 'estado_id=6',
    },
  }

  return (
    <Card className='h-50 w-65 transition-shadow hover:shadow-lg'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{part[state].title}</CardTitle>
        {part[state].icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${part[state].textColor}`}>{statsCount}</div>
        <p className='text-muted-foreground text-xs'>{part[state].detail}</p>
        {statsCount > 0 && (
          <Button
            variant='outline'
            size='sm'
            className='mt-2 w-full'
            onClick={() => navigate(`${url}?${part[state].params}`)}
          >
            Ver Detalles
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
