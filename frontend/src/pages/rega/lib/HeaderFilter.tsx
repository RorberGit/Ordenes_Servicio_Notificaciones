import React, { useCallback, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useDebouncedCallback } from 'use-debounce'

type HeaderFilterProps = {
  id: string
  placeholder?: string
  initialValue: string
  onFilterChange: (key: string, value: string) => void
}

const HeaderFilterComponent: React.FC<HeaderFilterProps> = ({
  id,
  placeholder,
  initialValue,
  onFilterChange,
}) => {
  const [value, setValue] = useState(initialValue)

  // ⛔ Lo importante: si cambian los filtros externamente, actualizamos la caja
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const debounced = useDebouncedCallback((v: string) => {
    onFilterChange(id, v)
  }, 500)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)
    debounced(v)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Input placeholder={placeholder} value={value} onChange={handleChange} />
}

export const HeaderFilter = React.memo(HeaderFilterComponent)
HeaderFilter.displayName = 'HeaderFilter'
HeaderFilterComponent.displayName = 'HeaderFilterComponent'
