'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const ZodSchemaOS = z
  .object({
    asunto: z.string().refine(val => val.length > 0, 'Este campo es requerido'),
    notificacion: z.string().optional(),
    tipo_contenido: z.string().optional(),
    lleva_respuesta: z.boolean().optional(),
    especialidad: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.lleva_respuesta) {
      if (!data.tipo_contenido) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El tipo de contenido es requerido cuando la orden de servicio lleva respuesta',
          path: ['tipo_contenido'],
        })
      }
    }

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
