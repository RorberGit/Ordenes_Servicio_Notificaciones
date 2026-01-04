import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { ZodResolverRega, type ZodSchemaTypeRega } from '../lib/ZodSchema'
import { defaultValues } from '../types'
import { useSearchParams } from 'react-router-dom'
import { useQueryRega } from '../hooks/use-QueryRega'
import FormBodyRega from './Components/form-body'
import useInsertEdit from '../hooks/use-InsertEdit'
import { regaSubmit } from '../utils/rega-Submit'

export default function FormInsertUpdateRega() {
  const [searchParams] = useSearchParams()
  const RegaId = searchParams.get('id')

  const isEditing = !!RegaId

  const form = useForm<ZodSchemaTypeRega>({
    resolver: ZodResolverRega,
    defaultValues: defaultValues,
  })

  // ✅ Obtener datos del usuario y la unidad
  const {
    regaData,
    isLoadingRega,
    regaError,
    usuario,
    unidad,
    procedenciaDestinoData,
    isLoadingProcedenciaDestino,
    procedenciaDestinoError,
    tipoDocumentoData,
    isLoadingTipoDocumento,
    tipoDocumentoError,
  } = useQueryRega(form, RegaId)

  // ➕ Hook para crear y actualizar el registro
  const { createRegaMutation, updateRegaMutation } = useInsertEdit(form, RegaId)

  // Función onSubmit del formulario
  const onSubmit = regaSubmit({
    isEditing,
    unidad,
    usuario,
    createRegaMutation,
    updateRegaMutation,
  })

  if (isLoadingRega && isEditing) {
    return (
      <Card className='mx-auto w-[800px]'>
        <CardHeader>
          <CardTitle>Cargando registro...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='h-6 w-full animate-pulse rounded bg-gray-300'></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if ((regaError || !regaData?.data) && isEditing) {
    return (
      <Card className='mx-auto w-[800px]'>
        <CardHeader>
          <CardTitle>Error al cargar el registro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-red-600'>No se pudo cargar el registro para editar.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='mx-auto max-w-[800px] min-w-3/4'>
      <CardHeader>
        <CardTitle>
          {!isEditing
            ? 'Nuevo Registro'
            : `Editar Registro # ${regaData?.data.registro_actual.num}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormBodyRega
          form={form}
          onSubmit={onSubmit}
          ProcesMutation={isEditing ? updateRegaMutation.isPending : createRegaMutation.isPending}
          procedenciaDestinoData={procedenciaDestinoData}
          isLoadingProcedenciaDestino={isLoadingProcedenciaDestino}
          procedenciaDestinoError={procedenciaDestinoError}
          tipoDocumentoData={tipoDocumentoData}
          isLoadingTipoDocumento={isLoadingTipoDocumento}
          tipoDocumentoError={tipoDocumentoError}
        />
      </CardContent>
    </Card>
  )
}
