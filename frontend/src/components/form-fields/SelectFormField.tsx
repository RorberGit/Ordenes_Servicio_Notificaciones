// components/form-fields/SelectFormField.tsx
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

// Interfaz para las opciones del Select
interface SelectOption {
  value: string
  label: string
}

interface SelectFormFieldProps<TFormSchema extends FieldValues> {
  control: Control<TFormSchema>
  name: FieldPath<TFormSchema>
  label: string
  placeholder?: string
  options: SelectOption[]
  onValueChange?: (value: string) => void
}

export function SelectFormField<TFormSchema extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  onValueChange,
}: SelectFormFieldProps<TFormSchema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={value => {
              field.onChange(value)
              if (onValueChange) onValueChange(value)
            }}
            value={(field.value as string) ?? ''}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder || `Seleccione un ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
