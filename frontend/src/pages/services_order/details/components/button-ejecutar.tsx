import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { getButtonClasses } from '@/pages/utils/button-class-utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { DatePickerFormField } from '@/components/form-fields/DatePickerFormField'
import { useUpdateRecord } from '@/hooks/useApiMutation'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import type { ApiResponse } from '@/services/apiClient'
import type { ServiceOrder } from '../../types'
import { logger } from '@/lib/logger'

interface ButtonEjecutarProps {
  id?: string
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<ApiResponse<ServiceOrder>, Error>>
}

const executeSchema = z.object({
  fecha_notificacion: z.date({
    required_error: 'La fecha de notificación es requerida',
  }),
})

type ExecuteFormData = z.infer<typeof executeSchema>

export default function ButtonEjecutar({ id, refetch }: ButtonEjecutarProps) {
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<ExecuteFormData>({
    resolver: zodResolver(executeSchema),
    defaultValues: {
      fecha_notificacion: new Date(),
    },
  })

  const updateMutation = useUpdateRecord(`/ordenes/update?id=${id}`, {
    onSuccess: () => {
      toast.success('Estado actualizado a En Progreso')
      refetch()
      setIsDialogOpen(false)
      form.reset()
    },
    onError: error => {
      toast.error('Error al actualizar el estado')
      logger.error('Error updating status:', error)
    },
  })

  const handleExecute = useCallback(
    (data: ExecuteFormData) => {
      if (!user?.username) {
        toast.error('Usuario no autenticado')
        return
      }

      const payload = {
        estado: 2,
        fecha_notificacion: data.fecha_notificacion.toISOString().split('T')[0],
        historico: {
          estado: 2,
          resumen: 'Orden de servicio iniciada',
          username: user.username,
        },
      }

      updateMutation.mutate(payload)
    },
    [user?.username, updateMutation],
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={getButtonClasses('Ejecutar')} disabled={!id || updateMutation.isPending}>
          Ejecutar
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Ejecutar Orden de Servicio</DialogTitle>
          <DialogDescription>
            Seleccione la fecha de notificación para iniciar la orden de servicio.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleExecute)} className='space-y-4'>
            <DatePickerFormField
              control={form.control}
              name='fecha_notificacion'
              label='Fecha de Notificación'
              disabled={updateMutation.isPending}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsDialogOpen(false)}
                disabled={updateMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Ejecutando...' : 'Ejecutar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
