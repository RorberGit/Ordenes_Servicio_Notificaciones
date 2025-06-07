//import { Button } from './components/ui/button'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

//import './App.css'
import { useEffect } from 'react'
//
import { ThemeProvider } from '@/components/theme-provider'
import { CardWithForm } from '@/pages/complementos/CardWithForm'
import { Ordenes } from '@/pages/OrdenesTrabajo'
import { ModeToggle } from '@/components/mode-toggle'

function App() {
  useEffect(() => {
    // * Aplica el tema inicial basado en localStorage o la preferencia del sistema
    const isDarkMode =
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // * Función para alternar el tema
  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark')

    if (isCurrentlyDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light') // Guarda la preferencia en localStorage
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark') // Guarda la preferencia en localStorage
    }
  }

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      {/* {children} */}
      <>
        <ModeToggle />
        <Ordenes />
        <div className='flex h-screen items-center justify-center'>
          <section className='py-32'>
            <div className='container'>
              <div className='flex flex-col gap-4'>
                <div className='mx-auto w-full max-w-sm rounded-md pb-6 shadow'>
                  <div className='mb-6 flex flex-col items-center'>
                    <h1 className='mb-2 text-2xl font-bold'>Login</h1>
                    <p className='text-muted-foreground'>Bienvenido</p>
                    <Button>Prueba 1</Button>
                    <Button>Prueba 2</Button>
                  </div>
                  <div>
                    <div className='grid gap-4'>
                      <Label htmlFor='txt1'>Texto de prueba 1</Label>
                      <Input id='txt1' placeholder='Nuevo texto 1' />
                      <div>
                        <Label htmlFor='txt2'>Texto de prueba 1</Label>
                        <Input id='txt2' placeholder='Nuevo texto 2' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <h1>Tema oscuro</h1>
          <Button onClick={toggleTheme}>Cambiar Tema</Button>
          <Button>Click me</Button>

          <br />
          <CardWithForm />
        </div>
      </>
    </ThemeProvider>
  )
}

export default App
