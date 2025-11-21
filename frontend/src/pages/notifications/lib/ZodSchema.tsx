'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const ZodSchemaNotification = z
  .object({
    numero_notificacion: z.coerce.number().refine(val => val.toString().length >= 4, {
      message: 'Debe ser un número no menor de 4 digitos',
    }),
    asunto: z.string().refine(val => val.length > 0, 'Este campo es requerido'),
    lleva_respuesta: z.boolean().optional(),
    numero_orden_respuesta: z.string().optional(),
    especialidad: z.array(z.string()).optional(),
    tipo_respuesta: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Si lleva respuesta es true, entonces numero_orden_respuesta es requerido
    // Si lleva respuesta es true, entonces tipo_respuesta es requerido
    if (data.lleva_respuesta) {
      if (!data.tipo_respuesta) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'El tipo de respuesta es requerido cuando la notificación lleva respuesta',
          path: ['tipo_respuesta'],
        })
      }
    }

    if (data.tipo_respuesta && data.tipo_respuesta === 'Plano' && data.especialidad?.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Las especialidades son requerias cuando Tipo respuesta es igual Plano',
        path: ['especialidad'],
      })
    }
  })

export const ZodResolverNotification = zodResolver(ZodSchemaNotification)

export type ZodSchemaTypeNotification = z.infer<typeof ZodSchemaNotification>
