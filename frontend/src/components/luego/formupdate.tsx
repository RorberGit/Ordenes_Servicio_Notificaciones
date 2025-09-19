// components/FormEditOS.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { ZodResolverOS, type ZodSchemaTypeOS } from '../lib/ZodSchema'
import { useParams } from 'react-router-dom' // Para obtener el ID de la URL
import { useEffect, useState } from 'react'

// Importa tus componentes de campo de formulario
import { InputFormField } from '@/components/form-fields/InputFormField'
import { TextareaFormField } from '@/components/form-fields/TextareaFormField'
import { DatePickerFormField } from '@/components/form-fields/DatePickerFormField'
import { SelectFormField } from '@/components/form-fields/SelectFormField'

// Importa tu servicio de API
import { fetchOSById, updateOS } from '@/services/osService' // Asegúrate de la ruta correcta

export default function FormEditOS() {
  const { id } = useParams<{ id: string }>() // Obtiene el ID de la URL como string
  const osId = id ? parseInt(id, 10) : undefined // Convierte el ID a número

  const [isLoadingData, setIsLoadingData] = useState(true)
  const [errorLoadingData, setErrorLoadingData] = useState<string | null>(null)

  // Inicializa React Hook Form con un estado de carga
  const form = useForm<ZodSchemaTypeOS>({
    resolver: ZodResolverOS,
    // defaultValues serán establecidos después de cargar los datos
    defaultValues: {
      numero_os: undefined,
      asunto: '',
      fecha_notificacion: undefined,
      notificacion: undefined,
      contenido: undefined,
      especialidad: undefined,
    },
  })

  const watchedContenido = form.watch('contenido')

  // Efecto para cargar los datos del registro al inicio
  useEffect(() => {
    if (osId === undefined || isNaN(osId)) {
      setErrorLoadingData('ID de Orden de Servicio no válido.')
      setIsLoadingData(false)
      return
    }

    const loadOSData = async () => {
      setIsLoadingData(true)
      setErrorLoadingData(null)
      try {
        const osData = await fetchOSById(osId)
        if (osData) {
          // Poblar el formulario con los datos obtenidos
          form.reset(osData) // `reset` establece los defaultValues y los valores del formulario
        } else {
          setErrorLoadingData(`Orden de Servicio con ID ${osId} no encontrada.`)
        }
      } catch (error) {
        console.error('Error al cargar la Orden de Servicio:', error)
        setErrorLoadingData('Error al cargar los datos de la Orden de Servicio.')
      } finally {
        setIsLoadingData(false)
      }
    }

    loadOSData()
  }, [osId, form]) // Dependencias: recargar si cambia el ID o la instancia del formulario

  // Efecto para resetear 'especialidad' si 'contenido' cambia y no es 'plano'
  useEffect(() => {
    if (watchedContenido !== 'plano') {
      form.setValue('especialidad', undefined, { shouldValidate: true })
      form.clearErrors('especialidad')
    }
  }, [watchedContenido, form])

  async function onSubmit(values: ZodSchemaTypeOS) {
    if (osId === undefined || isNaN(osId)) {
      setErrorLoadingData('No se puede actualizar: ID de Orden de Servicio no válido.')
      return
    }

    console.log('Valores a actualizar:', values)
    try {
      const updatedOS = await updateOS(osId, values)
      if (updatedOS) {
        console.log('Orden de Servicio actualizada con éxito:', updatedOS)
        // Opcional: Redirigir al usuario, mostrar un mensaje de éxito, etc.
      } else {
        setErrorLoadingData(`Error al actualizar la Orden de Servicio con ID ${osId}.`)
      }
    } catch (error) {
      console.error('Error al actualizar la Orden de Servicio:', error)
      setErrorLoadingData('Error al actualizar la Orden de Servicio.')
    }
  }

  if (isLoadingData) {
    return (
      <Card className='mx-auto max-w-[800px] min-w-3/4 p-6 text-center'>
        <CardTitle>Cargando Orden de Servicio...</CardTitle>
        <CardContent className='pt-4'>
          <p>Por favor, espere.</p>
        </CardContent>
      </Card>
    )
  }

  if (errorLoadingData) {
    return (
      <Card className='mx-auto max-w-[800px] min-w-3/4 p-6 text-center'>
        <CardTitle className='text-red-500'>Error</CardTitle>
        <CardContent className='pt-4'>
          <p>{errorLoadingData}</p>
          <Button onClick={() => window.location.reload()} className='mt-4'>
            Reintentar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='mx-auto max-w-[800px] min-w-3/4'>
      <CardHeader>
        <CardTitle>Editar Orden de Servicio #{osId}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* El número de OS podría ser de solo lectura en un formulario de edición */}
            <InputFormField
              control={form.control}
              name='numero_os'
              label='Número de Orden de Servicio'
              placeholder='Ej: 12345'
              type='number'
              // readOnly={true} // Opcional: Hacerlo de solo lectura
              // className="bg-gray-100 cursor-not-allowed" // Estilo para solo lectura
            />

            <TextareaFormField
              control={form.control}
              name='asunto'
              label='Asunto'
              placeholder='Describe brevemente la Orden de Servicio'
              rows={4}
            />

            <DatePickerFormField
              control={form.control}
              name='fecha_notificacion'
              label='Fecha de Notificación'
            />

            <InputFormField
              control={form.control}
              name='notificacion'
              label='Notificación que responde'
              placeholder='Número de notificación al que responde esta OS'
              type='number'
            />

            <SelectFormField
              control={form.control}
              name='contenido'
              label='Contenido'
              placeholder='Seleccione un tipo de contenido'
              options={[
                { value: 'plano', label: 'Plano' },
                { value: 'ft', label: 'FT (Ficha Técnica)' },
                { value: 'sloc', label: 'SL/OC' },
                { value: 'otros', label: 'Otros' },
              ]}
            />

            {watchedContenido === 'plano' && (
              <SelectFormField
                control={form.control}
                name='especialidad'
                label='Especialidad'
                placeholder='Selecciona la especialidad de la OS'
                options={[
                  { value: 'arquitetura', label: 'Arquitectura' },
                  { value: 'estructura', label: 'Estructura' },
                  { value: 'mecanica', label: 'Mecánica' },
                  { value: 'electricidad', label: 'Electricidad' },
                  { value: 'hidrosanitaria', label: 'Hidrosanitaria' },
                ]}
              />
            )}

            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                type='submit'
                className='bg-green-700 hover:bg-green-500'
                disabled={form.formState.isSubmitting || isLoadingData} // Deshabilita si carga o envía
              >
                {form.formState.isSubmitting ? 'Actualizando...' : 'Actualizar Orden'}
              </Button>
              <Button type='button' variant='destructive' onClick={() => form.reset()}>
                Restablecer
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
