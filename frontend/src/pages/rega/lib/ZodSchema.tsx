'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const ZodSchemaRega = z.object({
  descripcion: z.string().min(4, 'Descripción es requeridad'),
  entrada_salida: z.string().optional(),
  procedencia_destino_id: z.string().min(1, 'Procedimiento o destino es requerido'),
  tipo_documento_id: z.string().min(1, 'Tipo de documento es requerido'),
  archivo: z.instanceof(File).optional(),
})

export const ZodResolverRega = zodResolver(ZodSchemaRega)

export type ZodSchemaTypeRega = z.infer<typeof ZodSchemaRega>
