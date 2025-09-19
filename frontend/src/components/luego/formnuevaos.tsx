// FormNewOS.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { ZodResolverOS, type ZodSchemaTypeOS } from './lib/ZodSchema' // Asegúrate de la ruta correcta

// Importa tus nuevos componentes de campo de formulario
import { InputFormField } from '@/components/form-fields/InputFormField'
import { TextareaFormField } from '@/components/form-fields/TextareaFormField'
import { DatePickerFormField } from '@/components/form-fields/DatePickerFormField'
import { SelectFormField } from '@/components/form-fields/SelectFormField'

export default function FormNewOS() {
  const form = useForm<ZodSchemaTypeOS>({
    resolver: ZodResolverOS,
    defaultValues: {
      numero_os: undefined,
      asunto: '',
      fecha_notificacion: undefined, // Inicialmente undefined o null
      notificacion: undefined,
      contenido: undefined, // Inicialmente undefined si no hay una opción por defecto
      especialidad: undefined, // Inicialmente undefined si no hay una opción por defecto
    },
  })

  async function onSubmit(values: ZodSchemaTypeOS) {
    console.log('Valores del formulario:', values)
    // Aquí puedes enviar los datos a tu API
    // Ejemplo de simulación de API
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Formulario enviado con éxito!')
    // Opcional: Resetear el formulario después del envío exitoso
    // form.reset();
  }

  return (
    <Card className='mx-auto max-w-[800px] min-w-3/4'>
      {' '}
      {/* Ajuste de layout de la Card */}
      <CardHeader>
        <CardTitle>Nueva Orden de Servicio</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <InputFormField
              control={form.control}
              name='numero_os'
              label='Número de Orden de Servicio'
              placeholder='Ej: 12345'
              type='number'
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

            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                type='submit'
                className='bg-green-700 hover:bg-green-500'
                disabled={form.formState.isSubmitting} // Deshabilita durante el envío
              >
                {form.formState.isSubmitting ? 'Enviando...' : 'Aceptar'}
              </Button>
              <Button type='button' variant='destructive' onClick={() => form.reset()}>
                {' '}
                {/* Añadir un reset */}
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
