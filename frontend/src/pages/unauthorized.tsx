import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ShieldX, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Unauthorized() {
  const navigate = useNavigate()

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mb-4 flex justify-center'>
            <ShieldX className='text-destructive h-16 w-16' />
          </div>
          <CardTitle className='text-destructive text-2xl font-bold'>Acceso Denegado</CardTitle>
          <CardDescription className='text-base'>
            No tienes permisos para acceder a esta página.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Alert variant='destructive'>
            <AlertTitle>Autorización Requerida</AlertTitle>
            <AlertDescription>
              Esta sección requiere permisos especiales. Si crees que esto es un error, contacta al
              administrador del sistema.
            </AlertDescription>
          </Alert>
          <div className='flex justify-center'>
            <Button onClick={() => navigate('/')} variant='outline' className='w-full'>
              <Home className='mr-2 h-4 w-4' />
              Volver al Inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
