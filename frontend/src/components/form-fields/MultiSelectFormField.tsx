// components/form-fields/MultiSelectFormField.tsx
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ChevronDownIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useState } from 'react'

// Interfaz para las opciones del MultiSelect
interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectFormFieldProps<TFormSchema extends FieldValues> {
  control: Control<TFormSchema>
  name: FieldPath<TFormSchema>
  label: string
  placeholder?: string
  options: MultiSelectOption[]
  disabled?: boolean
}

export function MultiSelectFormField<TFormSchema extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Seleccione opciones',
  options,
  disabled = false,
}: MultiSelectFormFieldProps<TFormSchema>) {
  const [open, setOpen] = useState(false)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues = (field.value as string[]) || []
        const selectedLabels = options
          .filter(option => selectedValues.includes(option.value))
          .map(option => option.label)

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className={cn(
                      'w-full justify-between',
                      !selectedValues.length && 'text-muted-foreground',
                    )}
                    disabled={disabled}
                  >
                    {selectedValues.length > 0 ? (
                      <div className='flex flex-wrap gap-1'>
                        {selectedLabels.map(label => {
                          const option = options.find(opt => opt.label === label)
                          return (
                            <Badge
                              key={label}
                              variant='secondary'
                              className='flex items-center gap-1 px-2 py-0 text-xs'
                            >
                              {label}
                              {/*Boton para la eliminacion*/}
                              <span
                                role='button' // Lo identifica como un control que se puede hacer clic
                                tabIndex={0} // Lo hace enfocable con el teclado
                                aria-label={`Eliminar ${label}`} // Da una descripción para lectores de pantalla
                                className='hover:bg-secondary-foreground/20 ml-1 cursor-pointer rounded-full p-0.5' // Agrega cursor-pointer
                                onClick={e => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  const newValue = selectedValues.filter(
                                    value => value !== option?.value,
                                  )
                                  field.onChange(newValue)
                                }}
                                onKeyDown={e => {
                                  // Permite activarlo con la tecla Enter o Space
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    const newValue = selectedValues.filter(
                                      value => value !== option?.value,
                                    )
                                    field.onChange(newValue)
                                  }
                                }}
                              >
                                <XIcon className='h-3 w-3' />
                              </span>
                            </Badge>
                          )
                        })}
                      </div>
                    ) : (
                      placeholder
                    )}
                    <ChevronDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0' align='start'>
                <Command>
                  <CommandInput placeholder={`Buscar ${label.toLowerCase()}...`} />
                  <CommandList>
                    <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    <CommandGroup>
                      {options.map(option => {
                        const isSelected = selectedValues.includes(option.value)
                        return (
                          <CommandItem
                            key={option.value}
                            onSelect={() => {
                              const newValue = isSelected
                                ? selectedValues.filter(value => value !== option.value)
                                : [...selectedValues, option.value]
                              field.onChange(newValue)
                            }}
                            className='cursor-pointer'
                          >
                            <Checkbox checked={isSelected} className='mr-2' onChange={() => {}} />
                            {option.label}
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
