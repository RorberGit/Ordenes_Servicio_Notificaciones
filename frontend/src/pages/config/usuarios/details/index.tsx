import { useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useNavigate } from 'react-router-dom'
import type { UsuarioResponse } from '../view/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function UsuarioDetails() {
  const { id } = useParams<{ id: string }>()

  const navigate = useNavigate()

  const {
    data: usuarioData,
    isLoading,
    error,
    refetch,
  } = useApiQuery<UsuarioResponse>({
    url: `/usuarios/users/getone?id=${id}`,
  })

  const usuario = usuarioData?.data

  if (isLoading) {
    return (
      <Card className='mx-auto w-[800px]'>
        <CardHeader>
          <Skeleton className='h-8 w-64' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-6 w-full' />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !usuario) {
    return (
      <Card className='mx-auto w-[800px]'>
        <CardHeader>
          <CardTitle>Error al cargar los detalles del usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-red-600'>No se pudieron cargar los detalles del usuario.</p>
          <Button onClick={() => refetch()} className='mt-4'>
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  const ClassDiv = 'flex flex-row items-center gap-4'
  const ClassLabel = 'text-sm font-medium text-gray-700 dark:text-gray-300'

  return (
    <Card className='mx-auto w-[800px]'>
      <CardHeader>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              navigate('/config/usuarios/view', { replace: true, state: { refresh: true } })
            }
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver
          </Button>
          <CardTitle>Detalles del Usuario: {usuario.username}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid grid-cols-1 gap-4'>
          {/* ID */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>ID:</label>
            <p className='text-lg font-semibold'>{usuario.id}</p>
          </div>
          {/* Username */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Usuario:</label>
            <p>{usuario.username}</p>
          </div>
          {/* Fullname */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Nombre Completo:</label>
            <p>{usuario.fullname}</p>
          </div>
          {/* Email */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Email:</label>
            <p>{usuario.email}</p>
          </div>
          {/* Obra Principal */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Obra Principal:</label>
            <p>{usuario.obra_principal_nombre}</p>
          </div>
          {/* Rol */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Rol:</label>
            <p>{usuario.rol_nombre}</p>
          </div>
          {/* Estado */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Estado:</label>
            <Badge variant={usuario.active ? 'default' : 'secondary'}>
              {usuario.active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          {/* Obras Permitidas */}
          {usuario.obras_permitidas && usuario.obras_permitidas.length > 0 && (
            <div className={ClassDiv}>
              <label className={ClassLabel}>Obras Permitidas:</label>
              <div className='flex flex-wrap items-center gap-2'>
                {usuario.obras_permitidas.map((obra, index) => (
                  <Badge key={index} variant='outline' className='text-sm'>
                    {obra.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
