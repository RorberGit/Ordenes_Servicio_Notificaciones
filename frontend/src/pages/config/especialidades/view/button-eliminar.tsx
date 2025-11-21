import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'
import { useDeleteRecord } from '@/hooks/useApiMutation'
import { toast } from 'sonner'
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import type { ApiResponse } from '@/services/apiClient'
import type { EspecialidadResponse } from './types'

interface ButtonEliminarEspecialidadProps {
  id: number
  nombre: string
  refetch: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      ApiResponse<{
        results: EspecialidadResponse[]
        pagination: {
          count: number
          next: string | null
          previous: string | null
          current_page: number
          total_pages: number
        }
      }>,
      Error
    >
  >
}

export default function ButtonEliminarEspecialidad({
  id,
  nombre,
  refetch,
}: ButtonEliminarEspecialidadProps) {
  const [isOpen, setIsOpen] = useState(false)

  const deleteMutation = useDeleteRecord(`/especialidades/delete?id=${id}`, {
    onSuccess: () => {
      toast.success('Especialidad eliminada correctamente')
      refetch()
      setIsOpen(false)
    },
    onError: () => {
      toast.error('Error al eliminar la especialidad')
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='outline' size='sm' disabled={deleteMutation.isPending}>
          <Trash2 className='h-4 w-4' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la especialidad &quot;
            {nombre}&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className='bg-red-600 hover:bg-red-700'
          >
            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
