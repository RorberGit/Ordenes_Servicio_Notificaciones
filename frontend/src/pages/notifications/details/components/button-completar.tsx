import React, { useState, useCallback } from 'react'
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
import { getButtonClasses } from '@/pages/utils/button-class-utils'
import { useUpdateRecord } from '@/hooks/useApiMutation'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import type { ApiResponse } from '@/services/apiClient'
import type { Notification } from '../../types'
import { logger } from '@/lib/logger'

interface ButtonCompletarProps {
  id?: string
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<ApiResponse<Notification>, Error>>
}

export default function ButtonCompletar({ id, refetch }: ButtonCompletarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { user } = useAuth()

  const updateMutation = useUpdateRecord(`/notificaciones/update?id=${id}`, {
    onSuccess: () => {
      toast.success('Estado actualizado a Completado')
      refetch()
      setIsDialogOpen(false)
    },
    onError: error => {
      toast.error('Error al actualizar el estado')
      logger.error('Error updating status:', error)
    },
  })

  const handleComplete = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault()

      if (!user?.username) {
        toast.error('Usuario no autenticado')
        return
      }

      updateMutation.mutate({
        estado: 5,
        historico: {
          estado: 5,
          resumen: 'Notificación Completada',
          username: user.username,
        },
      })
    },
    [user?.username, updateMutation],
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className={getButtonClasses('Completar')}
          disabled={!id || updateMutation.isPending}
        >
          Completar
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Completar Orden de Servicio</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea completar esta orden de servicio?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleComplete} className='space-y-4'>
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
              {updateMutation.isPending ? 'Completando...' : 'Completar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
