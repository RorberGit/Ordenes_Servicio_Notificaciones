import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function useParams(currentPage: number) {
  const [searchParams, setSearchParams] = useSearchParams()

  // 👇 Modifica y almacena los parametros en la URL
  useEffect(() => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      newParams.set('page', String(currentPage))
      return newParams
    })
  }, [currentPage, setSearchParams])

  // Crea el nuevo paramtros para las consultas desde el react query
  const params = useMemo<Record<string, string | number>>(() => {
    const result: Record<string, string | number> = {}

    searchParams.forEach((value, key) => {
      result[key] = value
    })

    result.page = currentPage

    return result
  }, [currentPage, searchParams])

  return params
}
