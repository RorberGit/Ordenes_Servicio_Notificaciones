// components/form-fields/AutocompleteFormField.tsx
import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

// Interfaz para las opciones del Autocomplete
interface AutocompleteOption {
  value: string
  label: string
}

interface AutocompleteFormFieldProps<TFormSchema extends FieldValues> {
  control: Control<TFormSchema>
  name: FieldPath<TFormSchema>
  label: string
  placeholder?: string
  options: AutocompleteOption[]
}

export function AutocompleteFormField<TFormSchema extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
}: AutocompleteFormFieldProps<TFormSchema>) {
  const [open, setOpen] = useState(false)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col'>
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='w-full justify-between'
                >
                  {field.value
                    ? options.find(option => option.value === field.value)?.label
                    : placeholder || `Seleccione un ${label.toLowerCase()}`}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
              <Command>
                <CommandInput placeholder={`Buscar ${label.toLowerCase()}...`} />
                <CommandList>
                  <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                  <CommandGroup>
                    {options.map(option => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={() => {
                          field.onChange(option.value === field.value ? '' : option.value)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            field.value === option.value ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
