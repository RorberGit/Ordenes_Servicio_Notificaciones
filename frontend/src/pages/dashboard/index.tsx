import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useProject } from '@/context/ProjectContext'
import { logger } from '@/lib/logger'

export default function DashBoard() {
  const { login, logout, user } = useAuth()
  const { setActiveProject } = useProject()

  const userr = { id: 1, name: 'Alice' }

  logger.debug('Debug info:', userr)
  logger.info('App started successfully')
  logger.warn('Something might be wrong')
  logger.error('Critical error happened!')

  return (
    <div>
      <span className='m-2 flex justify-center'>DashBoard</span>
      <span>{user?.fullName}</span>
      <div className='grid grid-cols-2 space-x-2'>
        <Button
          onClick={() => {
            login({
              userName: 'jlosada',
              fullName: 'José A. Losada Legrá',
              projectName: 'almest',
              roles: ['Administrador'],
            })
            setActiveProject('UBI-RA')
          }}
        >
          Crear usuaio
        </Button>
        <Button onClick={() => logout()}>Borrar usuaio</Button>
      </div>
    </div>
  )
}
