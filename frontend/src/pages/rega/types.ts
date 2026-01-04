import type { UseFormReturn } from 'react-hook-form'

interface TypeInput {
  procedencia_destino: string
  ent_sal: string
  tipo_documento: string
  descripcion: string
}

interface PaginatedResponse {
  results: RegistrosResponse
  pagination: {
    count: number
    next: string | null
    previous: string | null
    current_page: number
    total_pages: number
  }
}

interface ProcedenciaDestino {
  id: string
  cod: string
  descripcion: string
}

interface TipoDocumento {
  id: string
  cod: string
  descripcion: string
}

interface Unidad {
  id: string
  cod: string
  descripcion: string
}

interface Usuario {
  id: string
  username: string
  fullname: string
}

interface RegistroOne {
  registro_actual: {
    id: string
    num: number
    descripcion: string
    ent_sal: string
    procedencia_destino: ProcedenciaDestino
    tipo_documento: TipoDocumento
    unidad: Unidad
    archivo?: string
    usuario?: Usuario
  }
  historial: HistorialType[]
}

interface Registro {
  id: string
  num: number
  descripcion: string
  entrada_salida: 'R/S' | 'R/E'
  procedencia_destino: ProcedenciaDestino | null
  tipo_documento: TipoDocumento | null
  unidad: Unidad | null
  usuario: Usuario | null
  usuario_nombre: string | null
  unidad_nombre: string | null
  created_at: string | null
  archivo?: string
}

type RegistrosResponse = Registro[]

interface RegistroPayload {
  descripcion: string
  ent_sal: string
  procedencia_destino_id?: string
  tipo_documento_id?: string
  unidad_id?: string
  usuario_id?: string
  archivo?: File
}

interface HistorialType {
  id: string
  history_user_nombre: string
  history_type_display: string
  created_at: Date
  updated_at: Date
  unidad_nombre: string
}

interface FormReg {
  descripcion: string
  procedencia_destino_id: string
  tipo_documento_id: string
  entrada_salida?: string | undefined
  archivo?: File | undefined
}

type useFormReg = UseFormReturn<FormReg>

export const defaultValues = {
  descripcion: '',
  entrada_salida: 'R/S',
  procedencia_destino_id: '',
  tipo_documento_id: '',
  archivo: undefined,
}

export type {
  PaginatedResponse,
  Registro,
  RegistroOne,
  RegistrosResponse,
  RegistroPayload,
  ProcedenciaDestino,
  TipoDocumento,
  Unidad,
  Usuario,
  HistorialType,
  useFormReg,
  TypeInput,
}
