// components/form-fields/DatePickerFormField.tsx
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils' // Asegúrate de tener este helper para combinar clases
import { format } from 'date-fns'
import { es } from 'date-fns/locale' // O el locale que necesites
import { CalendarIcon } from 'lucide-react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

interface DatePickerFormFieldProps<TFormSchema extends FieldValues> {
  control: Control<TFormSchema>
  name: FieldPath<TFormSchema>
  label: string
  // Puedes añadir más props si necesitas personalizar el calendario (ej. minDate, maxDate)
}

export function DatePickerFormField<TFormSchema extends FieldValues>({
  control,
  name,
  label,
}: DatePickerFormFieldProps<TFormSchema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {/* Asegúrate de que field.value sea de tipo Date o undefined para format */}
                  {field.value && typeof field.value === 'object' && 'getTime' in field.value ? (
                    format(field.value as Date, 'PPP', { locale: es })
                  ) : (
                    <span>Seleccione una fecha</span>
                  )}
                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={field.value as Date | undefined} // Cast para asegurar el tipo correcto para 'selected'
                onSelect={field.onChange}
                disabled={date => date > new Date() || date < new Date('1900-01-01')}
                captionLayout='dropdown'
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
