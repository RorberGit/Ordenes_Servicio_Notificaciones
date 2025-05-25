import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Aquí puedes manejar la lógica de autenticación
    console.log('Username:', username)
    console.log('Password:', password)
  }

  return (
    <div className='flex h-screen items-center justify-center bg-gray-100'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <Input
              type='text'
              placeholder='Usuario'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <Input
              type='password'
              placeholder='Contraseña'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin} className='w-full'>
              Acceder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
