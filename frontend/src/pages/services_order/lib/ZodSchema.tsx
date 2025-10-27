'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const ZodSchemaOS = z
  .object({
    asunto: z.string().refine(val => val.length > 0, 'Este campo es requerido'),
    notificacion: z.string().optional(),
    tipo_contenido: z.string().refine(val => val.length > 0, 'Debe seleccionar una opción'),
    especialidad: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo_contenido && data.tipo_contenido === 'Plano' && data.especialidad?.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Las especialidades son requerias cuando Tipo Contenido es igual Plano',
        path: ['especialidad'],
      })
    }
  })

export const ZodResolverOS = zodResolver(ZodSchemaOS)

export type ZodSchemaTypeOS = z.infer<typeof ZodSchemaOS>
