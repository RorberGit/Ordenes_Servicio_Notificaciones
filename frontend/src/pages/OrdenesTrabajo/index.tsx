import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { Responsable } from './components/Responsable'
import { format } from 'date-fns'

export function Ordenes() {
  const [date, setDate] = useState<Date>()
  return (
    <>
      <div className='flex h-screen items-center justify-center'>
        <Card className='w-full max-w-3/4'>
          <CardHeader>
            <CardTitle>Orden de Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-2'>
              <Input type='number' placeholder='Número de Orden' />
              <Textarea placeholder='Descripción' />
              <Input type='text' placeholder='Usuario creador' />
              <Responsable />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[280px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon />
                    {date ? format(date, 'PPP') : <span>Fecha de notificación</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar mode='single' selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Input type='text' placeholder='Notificación que responde' />
            </div>
          </CardContent>
          <CardFooter>
            <div className='flex w-full justify-end space-x-2'>
              <Button className='bg-green-700'>Aceptar</Button>
              <Button variant={'destructive'}>Cancelar</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
