import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Download } from 'lucide-react'
import Historial from '../../components/historico'
import type { RegistroOne } from '../../types'
import { useNavigate } from 'react-router-dom'

interface Props {
  registro: RegistroOne
  handleDownload: (registroId: string) => void
  id: string
}

export default function DetailsUI({ registro, handleDownload, id }: Props) {
  const ClassDiv = 'flex flex-row items-center gap-4'
  const ClassLabel = 'text-sm font-medium text-gray-700 dark:text-gray-300'

  const navigate = useNavigate()

  return (
    <Card className='mx-auto w-[800px]'>
      <CardHeader>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => navigate('/rega/view', { replace: true, state: { refresh: true } })}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver
          </Button>
          <CardTitle>Detalles del Registro # {registro.registro_actual.num}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='grid grid-cols-1 gap-4'>
          {/* Número */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Número:</label>
            <p className='text-lg font-semibold'>{registro.registro_actual.num}</p>
          </div>
          {/* Descripción */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Descripción:</label>
            <p>{registro.registro_actual.descripcion || '-'}</p>
          </div>
          {/* Entrada o Salida */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Entrada o Salida:</label>
            <p>{registro.registro_actual.ent_sal}</p>
          </div>
          {/* Procedencia o Destino */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Procedencia o Destino:</label>
            <p>
              {registro.registro_actual.procedencia_destino
                ? `${registro.registro_actual.procedencia_destino.cod} - ${registro.registro_actual.procedencia_destino.descripcion}`
                : '-'}
            </p>
          </div>
          {/* Tipo de Documento */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Tipo de Documento:</label>
            <p>
              {registro.registro_actual.tipo_documento
                ? `${registro.registro_actual.tipo_documento.cod} - ${registro.registro_actual.tipo_documento.descripcion}`
                : '-'}
            </p>
          </div>
          {/* Unidad */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Unidad:</label>
            <p>
              {registro.registro_actual.unidad
                ? `${registro.registro_actual.unidad.cod} - ${registro.registro_actual.unidad.descripcion}`
                : '-'}
            </p>
          </div>
          {/* Archivo */}
          <div className={ClassDiv}>
            <label className={ClassLabel}>Archivo:</label>
            {registro.registro_actual.archivo ? (
              <button
                onClick={() => handleDownload(id!)}
                className='flex items-center gap-1 text-blue-600 underline hover:text-blue-800'
              >
                <Download className='h-4 w-4' />
                {registro.registro_actual.archivo?.split('/').pop() || 'Archivo'}
              </button>
            ) : (
              <p>No hay archivo adjunto</p>
            )}
          </div>
        </div>
        <Historial historicos={registro.historial} />
      </CardContent>
    </Card>
  )
}
