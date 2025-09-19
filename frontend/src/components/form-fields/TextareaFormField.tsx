// components/form-fields/TextareaFormField.tsx
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

interface TextareaFormFieldProps<TFormSchema extends FieldValues> {
  control: Control<TFormSchema>
  name: FieldPath<TFormSchema>
  label: string
  placeholder?: string
  rows?: number
}

export function TextareaFormField<TFormSchema extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 4,
}: TextareaFormFieldProps<TFormSchema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder || label}
              rows={rows}
              className='resize-none'
              {...field}
              value={(field.value as string) ?? ''} // Asegura que el valor sea string
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
