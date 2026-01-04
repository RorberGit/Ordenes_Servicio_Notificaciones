// components/form-fields/FileUploadFormField.tsx
import { useRef } from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form'

interface FileUploadFormFieldProps<TFormSchema extends FieldValues> {
  control: Control<TFormSchema>
  name: FieldPath<TFormSchema>
  label: string
  placeholder?: string
  accept?: string
  disabled?: boolean
}

export function FileUploadFormField<TFormSchema extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Seleccionar archivo',
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
  disabled = false,
}: FileUploadFormFieldProps<TFormSchema>) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className='space-y-2'>
              <input
                type='file'
                accept={accept}
                disabled={disabled}
                ref={fileInputRef}
                onChange={e => {
                  const file = e.target.files?.[0]
                  onChange(file)
                }}
                className='hidden'
              />
              <div className='flex items-center space-x-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className='flex items-center space-x-2'
                >
                  <Upload className='h-4 w-4' />
                  <span>{placeholder}</span>
                </Button>
                {value && (
                  <span className='text-sm text-gray-600'>Archivo seleccionado: {value.name}</span>
                )}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
