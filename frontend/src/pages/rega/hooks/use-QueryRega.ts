import { useEffect, useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'
import { toast } from 'sonner'
import type { ProcedenciaDestino, RegistroOne, TipoDocumento, Unidad, Usuario } from '../types'
import { useAuth } from '@/context/AuthContext'

type ProcedenciaDestinoResponse = ProcedenciaDestino[]
type TipoDocumentoResponse = TipoDocumento[]
type UnidadResponse = Unidad[]
type UsuarioResponse = Usuario[]

export function useQueryRega(RegaId?: string | null) {
  const { user } = useAuth()

  const ID = RegaId ? RegaId : ''

  const [usuario, setUsuario] = useState('')
  const [unidad, setUnidad] = useState('')

  // * Query para obtener el registro a editar
  const {
    data: regaData,
    isLoading: isLoadingRega,
    error: regaError,
  } = useApiQuery<RegistroOne>({
    url: `/registros/getone?id=${ID}`,
    queryKey: ['rega', ID],
    enabled: !!RegaId,
  })

  // * API Procedencia Destino
  const {
    data: procedenciaDestinoData,
    isLoading: isLoadingProcedenciaDestino,
    error: procedenciaDestinoError,
  } = useApiQuery<ProcedenciaDestinoResponse>({
    url: '/procedencia-destino/getall/',
    queryKey: ['procedencia-destino'],
  })

  // * API Tipo Documento
  const {
    data: tipoDocumentoData,
    isLoading: isLoadingTipoDocumento,
    error: tipoDocumentoError,
  } = useApiQuery<TipoDocumentoResponse>({
    url: '/tipo-documento/getall/',
    queryKey: ['tipo-documento'],
  })

  // * API Unidad
  const {
    data: unidadData,
    isLoading: isLoadingUnidad,
    error: unidadError,
  } = useApiQuery<UnidadResponse>({
    url: '/unidad/getall/',
    queryKey: ['unidad'],
  })

  // * API Usuarios
  const {
    data: usuarioData,
    isLoading: isLoadingUsuario,
    error: usuarioError,
  } = useApiQuery<UsuarioResponse>({
    url: '/usuarios/users/',
    queryKey: ['usuarios'],
  })

  useEffect(() => {
    if (procedenciaDestinoError) {
      toast.error('Error al cargar procedencias/destinos', {
        description: 'Se usarán valores por defecto. Verifique su conexión.',
      })
    }
  }, [procedenciaDestinoError])

  useEffect(() => {
    if (tipoDocumentoError) {
      toast.error('Error al cargar tipos de documento', {
        description: 'Se usarán valores por defecto. Verifique su conexión.',
      })
    }
  }, [tipoDocumentoError])

  useEffect(() => {
    if (unidadError) {
      toast.error('Error al cargar unidades', {
        description: 'Se usarán valores por defecto. Verifique su conexión.',
      })
    }
  }, [unidadError])

  useEffect(() => {
    if (usuarioError) {
      toast.error('Error al cargar usuarios', {
        description: 'Se usarán valores por defecto. Verifique su conexión.',
      })
    }
  }, [usuarioError])

  // Set usuario and unidad from auth context
  useEffect(() => {
    if (user && usuarioData?.data && unidadData?.data) {
      const currentUser = usuarioData.data.find(u => u.username === user.username)
      const currentUnidad = unidadData.data.find(u => u.descripcion === user.unidad)

      if (currentUser) {
        setUsuario(currentUser.id)
      }
      if (currentUnidad) {
        setUnidad(currentUnidad.id)
      }
    }
  }, [user, usuarioData, unidadData])

  return {
    regaData,
    isLoadingRega,
    regaError,
    procedenciaDestinoData,
    isLoadingProcedenciaDestino,
    procedenciaDestinoError,
    tipoDocumentoData,
    isLoadingTipoDocumento,
    tipoDocumentoError,
    unidadData,
    isLoadingUnidad,
    unidadError,
    usuarioData,
    isLoadingUsuario,
    usuarioError,
    usuario,
    unidad,
  }
}
