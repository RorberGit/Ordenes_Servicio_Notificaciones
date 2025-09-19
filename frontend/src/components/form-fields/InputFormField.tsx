// components/form-fields/InputFormField.tsx
import React from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form'

interface InputFormFieldProps<TFormSchema extends FieldValues> {
  control: Control<TFormSchema>
  name: FieldPath<TFormSchema>
  label: string
  placeholder?: string
  type?: React.HTMLInputTypeAttribute // Usa el tipo de HTML para mayor precisión
}

export function InputFormField<TFormSchema extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
}: InputFormFieldProps<TFormSchema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {/* Se asegura de que el valor sea string para los inputs */}
            <Input
              type={type}
              placeholder={placeholder || label}
              {...field}
              value={(field.value as string) ?? ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
