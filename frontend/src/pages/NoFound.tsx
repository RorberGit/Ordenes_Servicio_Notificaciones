import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='mb-4 flex justify-center'>
            <FileQuestion className='text-muted-foreground h-16 w-16' />
          </div>
          <CardTitle className='text-primary text-6xl font-extrabold'>404</CardTitle>
          <CardDescription className='text-base'>Página no encontrada</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-muted-foreground text-center'>
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
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
