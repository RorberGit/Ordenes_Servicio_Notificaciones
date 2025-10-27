import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    // Aquí puedes manejar la lógica de autenticación
    console.log('Username:', username)
    console.log('Password:', password)
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      {/* bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900' */}
      <div className='w-full max-w-md'>
        {/* Logo o imagen de la empresa */}
        <div className='mb-8 text-center'>
          <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'>
            <User className='h-10 w-10 text-white' />
          </div>
          <h1 className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>Bienvenido</h1>
          <p className='text-gray-600 dark:text-gray-300'>Inicia sesión en tu cuenta</p>
        </div>

        <Card className='border-0 bg-white/80 shadow-2xl backdrop-blur-sm dark:bg-gray-800/80'>
          <CardHeader className='pb-2 text-center'>
            <CardTitle className='text-2xl font-semibold text-gray-800 dark:text-white'>
              Iniciar Sesión
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <Label
                htmlFor='username'
                className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                <User className='h-4 w-4' />
                Nombre de usuario
              </Label>
              <div className='relative'>
                <Input
                  id='username'
                  type='text'
                  placeholder='tu_usuario'
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className='rounded-lg border-2 border-gray-200 bg-white py-3 pr-4 pl-4 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-800'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='password'
                className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'
              >
                <Lock className='h-4 w-4' />
                Contraseña
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className='rounded-lg border-2 border-gray-200 bg-white py-3 pr-12 pl-4 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-800'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                >
                  {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              className='w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
            >
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className='mt-8 text-center'>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            © 2024 ALMEST. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
