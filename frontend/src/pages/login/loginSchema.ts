// src/schemas/auth.ts
import { z } from 'zod'

// 1. Esquema de validación del formulario de login
export const loginFormSchema = z.object({
  username: z.string().min(2, {
    message: 'El nombre de usuario debe tener al menos 2 caracteres.',
  }),
  password: z.string().min(2, {
    message: 'La contraseña debe tener al menos 2 caracteres.',
  }),
})

// 2. Tipo derivado del esquema para usar en TypeScript
export type LoginFormValues = z.infer<typeof loginFormSchema>

// 3. Tipo de respuesta de la API (ajustar según tu backend)
export type AuthResponse = {
  token: string
  user: {
    id: number
    username: string
    email: string
  }
}
