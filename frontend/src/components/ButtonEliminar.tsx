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

interface ButtonEliminarProps<TData = unknown> {
  endpoint: string
  id: string | number
  nombre: string | undefined
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<ApiResponse<TData>, Error>>
}

export default function ButtonEliminar<TData = unknown>({
  endpoint,
  id,
  nombre,
  refetch,
}: ButtonEliminarProps<TData>) {
  const [isOpen, setIsOpen] = useState(false)

  const deleteMutation = useDeleteRecord(`${endpoint}?id=${id}`, {
    onSuccess: () => {
      toast.success('Registro eliminado correctamente')
      refetch()
      setIsOpen(false)
    },
    onError: () => {
      toast.error('Error al eliminar el registro')
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
            Esta acción no se puede deshacer. Se eliminará permanentemente el registro &quot;
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
