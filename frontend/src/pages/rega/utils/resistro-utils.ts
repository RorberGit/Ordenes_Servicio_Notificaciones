import dayjs from 'dayjs'
import type { Registro } from '../types'

// utils/registro-utils.ts
export const generateRegistroCode = (reg: Registro): string => {
  const tipo = reg.tipo_documento?.cod ?? '-'
  const unidad = reg.unidad?.cod ?? '-'
  const year = reg.created_at ? dayjs(reg.created_at).format('YY') : '-'
  return `${tipo}-${unidad}-${reg.num}-${year}`
}
