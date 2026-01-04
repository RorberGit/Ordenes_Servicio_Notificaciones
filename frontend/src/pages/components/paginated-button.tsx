import { Button } from '@/components/ui/button'
import type React from 'react'

interface Props {
  currentPage: number
  previous: string | null | undefined
  next: string | null | undefined
  totalPages: number
  setCurrentPage: (value: React.SetStateAction<number>) => void
}

export default function PaginatedButton({
  currentPage,
  previous,
  next,
  totalPages,
  setCurrentPage,
}: Props) {
  return (
    <div className='mt-4 flex items-center justify-between'>
      <Button
        variant='outline'
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={!previous}
      >
        Anterior
      </Button>
      <span className='text-sm text-gray-600'>
        Página {currentPage} de {totalPages}
      </span>
      <Button variant='outline' onClick={() => setCurrentPage(currentPage + 1)} disabled={!next}>
        Siguiente
      </Button>
    </div>
  )
}
