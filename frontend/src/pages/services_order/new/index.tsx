import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { ZodResolverOS, type ZodSchemaTypeOS } from '../lib/ZodSchema'
import { Form } from '@/components/ui/form'
import { useEffect } from 'react'
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
      fecha_notificacion: undefined,
      notificacion: undefined,
      contenido: '',
      especialidad: '',
    },
  })

  // 1. Observa el valor del campo 'contenido'
  const watchedContenido = form.watch('contenido')

  // 2. Efecto para resetear 'especialidad' si 'contenido' cambia y no es 'plano'
  useEffect(() => {
    if (watchedContenido !== 'plano') {
      // Resetea el valor de 'especialidad' y borra sus errores
      form.setValue('especialidad', undefined, { shouldValidate: true })
      form.clearErrors('especialidad')
    }
  }, [watchedContenido, form]) // Dependencias del efecto

  function onSubmit(values: ZodSchemaTypeOS) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Card className='mx-auto max-w-[800px] min-w-3/4'>
      <CardHeader>
        <CardTitle>Nueva Orden de Servicio</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Número de Orden de Servicio */}
            <InputFormField
              control={form.control}
              name='numero_os'
              label='Número de Orden de Servicio'
              placeholder='Ej: 12345'
              type='number'
            />

            {/* Asunto */}
            <TextareaFormField
              control={form.control}
              name='asunto'
              label='Asunto'
              placeholder='Describe brevemente la Orden de Servicio'
              rows={4}
            />

            {/* Fecha de Notificación */}
            <DatePickerFormField
              control={form.control}
              name='fecha_notificacion'
              label='Fecha de Notificación'
            />

            {/* Notificación que responde */}
            <InputFormField
              control={form.control}
              name='notificacion'
              label='Notificación que responde'
              placeholder='Número de notificación al que responde esta OS'
              type='number'
            />

            {/* Contenido */}
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

            {/* Especialidad */}
            {/* Renderizado Condicional: Solo muestra Especialidad si contenido es 'plano' */}
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

            {/* Botones */}
            <div className='flex justify-end space-x-2 pt-4'>
              <Button
                type='submit'
                className='bg-green-700 hover:bg-green-500'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Enviando...' : 'Aceptar'}
              </Button>
              <Button type='button' variant='destructive' onClick={() => form.reset()}>
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      {/* Footer con información de presentación del sitio */}
      <footer className='bg-muted/50 mt-6 border-t px-6 py-4'>
        <div className='text-muted-foreground flex flex-col items-center justify-between gap-2 text-sm sm:flex-row'>
          <div className='flex items-center gap-2'>
            <span>© 2024 ALMEST</span>
            <span className='hidden sm:inline'>•</span>
            <span className='hidden sm:inline'>Sistema de Órdenes de Servicio</span>
          </div>
          <div className='flex items-center gap-4'>
            <a href='#' className='hover:text-foreground transition-colors' aria-label='Ayuda'>
              Ayuda
            </a>
            <a href='#' className='hover:text-foreground transition-colors' aria-label='Contacto'>
              Contacto
            </a>
          </div>
        </div>
      </footer>
      {/* Creación de los creditos del sitio */}
      <div>
        <span>rorber rodriguez arcaya</span>
        <></>
      </div>
      {/* <CardFooter className='flex justify-end space-x-2'>
        <Button className='bg-green-700 hover:bg-green-500'>Aceptar</Button>
        <Button variant='destructive'>Cancelar</Button>
      </CardFooter> */}
    </Card>
  )
}
