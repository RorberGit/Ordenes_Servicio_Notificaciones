import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  titles: string
  count: number
  currentPage: number
  totalPages: number
  url: string
}

export default function CardHeaderView({ titles, count, currentPage, totalPages, url }: Props) {
  const navigate = useNavigate()

  return (
    <CardHeader>
      <CardTitle>{titles}</CardTitle>
      <div className='flex items-center justify-between'>
        <div className='text-sm text-gray-600'>
          Total de registros: {count} | Página {currentPage} de {totalPages}
        </div>
        <Button onClick={() => navigate(url)} className='bg-green-700 hover:bg-green-500'>
          <Plus className='mr-2 h-4 w-4' />
          Nuevo registro
        </Button>
      </div>
    </CardHeader>
  )
}
