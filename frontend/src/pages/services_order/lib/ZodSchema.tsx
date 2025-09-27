'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const ZodSchemaOS = z
  .object({
    numero_orden: z.coerce
      .number()
      .refine(val => val.toString().length >= 4, { message: 'Debe ser un número de 4 digitos' }),
    asunto: z.string().refine(val => val.length > 0, 'Este campo es requerido'),
    fecha_notificacion: z.date().optional(),
    notificacion: z.coerce
      .number({ message: 'Debe ser un número' })
      .gt(0, 'Debe ser un número mayor que cero')
      .optional(),
    tipo_contenido: z.string({ required_error: 'Debe seleccionar una opción' }),
    especialidad: z.string({ required_error: 'Debe seleccionar una opción' }).optional(),
  })
  .superRefine((data, ctx) => {
    // Validar que si contenido es plano, entonces debe de haber una especialidad seleccionada
    if (
      data.tipo_contenido === 'plano' &&
      (!data.especialidad || data.especialidad.trim() === '')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debe seleccionar una especialidad si el contenido es plano',
        path: ['especialidad'], // Indicar que el error está en el campo especialidad
      })
    }
  })

export const ZodResolverOS = zodResolver(ZodSchemaOS)

export type ZodSchemaTypeOS = z.infer<typeof ZodSchemaOS>
