import { useNavigate } from 'react-router-dom'
import { useApiQuerySimple } from '@/hooks/useApiQuery-bueno'
import { useWork } from '@/context/WorkContext'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Building } from 'lucide-react'

interface Obra {
  id: number
  nombre: string
  descripcion?: string
}

interface ObrasResponse {
  data: Obra[]
  message: string
  success: string
}

export default function SelectWork() {
  const navigate = useNavigate()
  const { activeWork, setActiveWork } = useWork()
  const { user } = useAuth()

  // Consulta para obtener la lista de obras
  const {
    data: obras,
    isLoading,
    error,
  } = useApiQuerySimple<ObrasResponse>({
    url: '/obras/getall',
    queryKey: ['obras'],
  })

  // Filtrar obras permitidas para el usuario
  const obrasPermitidas =
    obras?.data.filter(obra => user?.obras_permitidas?.includes(obra.nombre)) || []

  const handleSelectWork = (obra: Obra) => {
    setActiveWork(obra.nombre)
    navigate('/') // Redirigir al dashboard o página principal
  }

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <span className='ml-2'>Cargando obras...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <p className='mb-4 text-red-500'>Error al cargar las obras</p>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold'>Seleccionar Obra</h1>
          <p className='text-muted-foreground'>
            Elige la obra en la que deseas trabajar actualmente
          </p>
          {activeWork && (
            <p className='mt-2 text-sm text-blue-600'>
              Obra actual: <strong>{activeWork}</strong>
            </p>
          )}
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {obrasPermitidas.map((obra: Obra) => (
            <Card
              key={obra.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeWork === obra.nombre ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleSelectWork(obra)}
            >
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Building className='h-5 w-5' />
                  {obra.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {obra.descripcion && (
                  <p className='text-muted-foreground text-sm'>{obra.descripcion}</p>
                )}
                {activeWork === obra.nombre && (
                  <div className='mt-2 text-sm font-medium text-blue-600'>Obra activa</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {obrasPermitidas.length === 0 && (
          <div className='py-12 text-center'>
            <Building className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <p className='text-muted-foreground'>No hay obras disponibles</p>
          </div>
        )}

        <div className='mt-8 text-center'>
          <Button variant='outline' onClick={() => navigate('/')}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
