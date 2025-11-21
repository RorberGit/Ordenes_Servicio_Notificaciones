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
import { useUpdateRecord } from '@/hooks/useApiMutation'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import type { ApiResponse } from '@/services/apiClient'
import type { Notification } from '../../types'
import { InputFormField } from '@/components/form-fields/InputFormField'
import { logger } from '@/lib/logger'

interface ButtonCancelarProps {
  id?: string
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<ApiResponse<Notification>, Error>>
}

const cancelSchema = z.object({
  resumen: z
    .string({ required_error: 'El motivo es requerido' })
    .min(5, 'Debe ingresar al menos 5 caracteres'),
})

type CancelFormData = z.infer<typeof cancelSchema>

export default function ButtonCancelar({ id, refetch }: ButtonCancelarProps) {
  const { user } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<CancelFormData>({
    resolver: zodResolver(cancelSchema),
    defaultValues: { resumen: '' },
  })

  const updateMutation = useUpdateRecord(`/notificaciones/update?id=${id}`, {
    onSuccess: () => {
      toast.success('Estado actualizado a Cancelado')
      refetch()
      setIsDialogOpen(false)
      form.reset()
    },
    onError: error => {
      logger.error('Error en la cancelación de la notificación', error)
      toast.error('Error al actualizar el estado')
    },
  })

  const handleCancelar = useCallback(
    (data: CancelFormData) => {
      if (!user?.username) {
        toast.error('Usuario no autenticado')
        return
      }

      updateMutation.mutate({
        estado: 6,
        historico: {
          estado: 6,
          resumen: data.resumen.trim(),
          username: user.username,
        },
      })
    },
    [user?.username, updateMutation],
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={getButtonClasses('Cancelar')} disabled={!id || updateMutation.isPending}>
          Cancelar
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Cancelar Notificación</DialogTitle>
          <DialogDescription>
            Ingrese un breve resumen del motivo de la cancelación.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCancelar)} className='space-y-4'>
            <InputFormField
              name='resumen'
              label='Motivo'
              placeholder='Ejemplo: El cliente solicitó la anulación...'
              control={form.control}
              disabled={updateMutation.isPending}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsDialogOpen(false)}
                disabled={updateMutation.isPending}
              >
                Cerrar
              </Button>
              <Button type='submit' disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Cancelando...' : 'Confirmar Cancelación'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
