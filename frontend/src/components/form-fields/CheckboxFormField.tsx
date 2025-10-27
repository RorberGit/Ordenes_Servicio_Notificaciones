// components/form-fields/CheckboxFormField.tsx
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form'

interface CheckboxFormFieldProps<TFormSchema extends FieldValues> {
  control: Control<TFormSchema>
  name: FieldPath<TFormSchema>
  label: string
  description?: string
}

export function CheckboxFormField<TFormSchema extends FieldValues>({
  control,
  name,
  label,
  description,
}: CheckboxFormFieldProps<TFormSchema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className='space-y-1 leading-none'>
            <FormLabel>{label}</FormLabel>
            {description && <p className='text-muted-foreground text-sm'>{description}</p>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
