import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useLogin } from '@/hooks/useLogin'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { loginFormSchema, type LoginFormValues } from './loginSchema'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useWork } from '@/context/WorkContext'
import { useAuth } from '@/context/AuthContext'
import { logger } from '@/lib/logger'

export default function Login() {
  const { mutate, isPending, error, isError, isSuccess, data } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const { login } = useAuth()
  const { setActiveWork } = useWork()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  useEffect(() => {
    if (isError && error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (error as any).response?.status
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const detail = (error as any).response?.data?.detail

      if (status === 404) {
        form.setError('username', { message: detail })
        toast.error(detail)
      } else if (status === 406) {
        form.setError('password', { message: detail })
        toast.error(detail)
      } else if (status === 403) {
        toast.error(detail)
      } else {
        toast.error('Error desconocido en el login')
      }
    }

    if (isSuccess && data) {
      toast.success('Login exitoso')
      logger.info('Login data:', JSON.stringify(data, null, 2))
      if (data.user) {
        login(data.user, {
          access_token: data.access_token || '',
          refresh_token: data.refresh_token || '',
        })
        setActiveWork(data.user.obra_principal_nombre)
      }
      navigate('/')
    }
  }, [isError, error, isSuccess, data, form, navigate, login, setActiveWork])

  const onSubmit = (values: LoginFormValues) => {
    // Aquí puedes manejar la lógica de autenticación
    mutate(values)
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
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
          <CardContent className='space-y-6'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='mb-4 space-y-2'>
                  <Label
                    htmlFor='username'
                    className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    <User className='h-4 w-4' />
                    Nombre de usuario
                  </Label>
                  {/* Campo de Username */}

                  <div className='relative'>
                    <FormField
                      control={form.control}
                      name='username'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder='Nombre de Usuario'
                              {...field}
                              className='rounded-lg border-2 border-gray-200 bg-white py-3 pr-4 pl-4 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-800'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className='mb-4 space-y-2'>
                  <Label
                    htmlFor='password'
                    className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    <Lock className='h-4 w-4' />
                    Contraseña
                  </Label>
                  <div className='relative'>
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder='••••••••'
                              {...field}
                              className='rounded-lg border-2 border-gray-200 bg-white py-3 pr-12 pl-4 text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-800'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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
                  type='submit'
                  className='w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
                  disabled={isPending}
                >
                  {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
