import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { InputFormField } from '@/components/form-fields/InputFormField'
import { SelectFormField } from '@/components/form-fields/SelectFormField'
import { MultiSelectFormField } from '@/components/form-fields/MultiSelectFormField'
import { CheckboxFormField } from '@/components/form-fields/CheckboxFormField'

import { useUpdateRecord } from '@/hooks/useApiMutation'
import { useApiQuery } from '@/hooks/useApiQuery-bueno'

import type { UsuarioResponse, UsuarioPayload, Rol } from '../view/types'
import type { ApiError } from '@/pages/types/types-comun'

// 🔹 Esquema de validación
const usuarioSchema = z.object({
  username: z.string().min(1, 'El username es requerido'),
  fullname: z.string().min(1, 'El nombre completo es requerido'),
  email: z.string().email('Email inválido'),
  obra_principal: z.string().min(1, 'La obra principal es requerida'),
  active: z.boolean(),
  rol: z.string().min(1, 'El rol es requerido'),
  obras_permitidas: z.array(z.string()),
  unidad: z.string().min(1, 'La unidad es requerida'),
})

type UsuarioFormData = z.infer<typeof usuarioSchema>

export default function FormEditUsuario() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  console.log(id)

  // --- Formulario ---
  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      username: '',
      fullname: '',
      email: '',
      obra_principal: '',
      active: false,
      rol: '',
      obras_permitidas: [],
      unidad: '',
    },
  })

  // --- Queries ---
  const { data: usuarioData, isLoading: isLoadingUsuario } = useApiQuery<UsuarioResponse>({
    url: isEditing ? `/usuarios/users/getone?id=${id}` : '',
    enabled: isEditing,
    refetchOnMount: 'always',
  })

  const { data: rolesData, isLoading: isLoadingRoles } = useApiQuery<Rol[]>({
    url: '/usuarios/roles/getall/',
    refetchOnMount: 'always',
  })

  const { data: obrasData, isLoading: isLoadingObras } = useApiQuery<
    { id: string; nombre: string; descripcion?: string }[]
  >({
    url: '/obras/getall/',
    queryKey: ['obras'],
    refetchOnMount: 'always',
  })

  const { data: unidadesData, isLoading: isLoadingUnidades } = useApiQuery<
    { id: string; cod: string; descripcion?: string }[]
  >({
    url: '/unidad/getall/',
    queryKey: ['unidades'],
    refetchOnMount: 'always',
  })

  // --- Opciones memoizadas ---
  const rolesOptions = useMemo(
    () => rolesData?.data?.map(r => ({ value: r.id, label: r.nombre })) || [],
    [rolesData],
  )

  const obrasOptions = useMemo(
    () => obrasData?.data?.map(o => ({ value: o.id, label: o.nombre })) || [],
    [obrasData],
  )

  const unidadesOptions = useMemo(
    () =>
      unidadesData?.data?.map(u => ({
        value: u.id,
        label: u.descripcion ? `${u.cod} - ${u.descripcion}` : u.cod,
      })) || [],
    [unidadesData],
  )

  // --- Cargar datos del usuario al editar ---
  useEffect(() => {
    if (!isEditing) return
    if (!usuarioData?.data) return
    if (!rolesData?.data?.length || !obrasData?.data?.length || !unidadesData?.data?.length) return

    const u = usuarioData.data
    const obrasPermitidasIds = (u.obras_permitidas || []).map(op => op.id || '')

    setTimeout(() => {
      form.reset({
        username: u.username,
        fullname: u.fullname,
        email: u.email,
        obra_principal: String(u.obra_principal) || '',
        active: !!u.active,
        rol: u.rol || '',
        obras_permitidas: obrasPermitidasIds,
        unidad: u.unidad ? u.unidad.id : '',
      })
    }, 100)
  }, [isEditing, usuarioData, rolesData, obrasData, unidadesData, form])

  // --- Mutación ---
  const updateUsuarioMutation = useUpdateRecord<UsuarioResponse, UsuarioPayload>(
    `/usuarios/users/${id}/update/`,
    {
      onSuccess: data => {
        toast.success('Usuario actualizado exitosamente', {
          description: `Usuario "${data?.data.username}" ha sido actualizado`,
        })
        navigate('/config/usuarios/view', { replace: true, state: { refresh: true } })
      },
      onError: error => {
        const apiError = error as ApiError
        const errorMessage = apiError.response?.data?.message || 'Ha ocurrido un error inesperado'
        toast.error('Error al actualizar el usuario', { description: errorMessage })
      },
    },
  )

  // --- Submit ---
  const onSubmit = (values: UsuarioFormData) => {
    const dataToSend: UsuarioPayload = {
      username: values.username,
      fullname: values.fullname,
      email: values.email,
      obra_principal: values.obra_principal,
      active: values.active,
      rol: values.rol,
      obras_permitidas: values.obras_permitidas,
      unidad: values.unidad,
    }
    updateUsuarioMutation.mutate(dataToSend)
  }

  // --- Estado de carga ---
  const isLoading = isLoadingUsuario || isLoadingRoles || isLoadingObras || isLoadingUnidades

  if (isLoading) {
    return (
      <Card className='mx-auto max-w-[1000px] min-w-3/4 animate-pulse'>
        <CardHeader>
          <CardTitle>Cargando información del usuario...</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='h-6 w-1/2 rounded bg-gray-300'></div>
          <div className='h-6 w-2/3 rounded bg-gray-300'></div>
          <div className='h-6 w-full rounded bg-gray-300'></div>
          <div className='h-6 w-3/4 rounded bg-gray-300'></div>
        </CardContent>
      </Card>
    )
  }

  // --- Render principal ---
  return (
    <div>
      <Card className='mx-auto max-w-[1000px] min-w-3/4'>
        <CardHeader>
          <CardTitle>Editar Usuario</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <InputFormField
                control={form.control}
                name='username'
                label='Username'
                placeholder='Ingrese el username'
                disabled={isEditing}
              />

              <InputFormField
                control={form.control}
                name='fullname'
                label='Nombre Completo'
                placeholder='Ingrese el nombre completo'
              />

              <InputFormField
                control={form.control}
                name='email'
                label='Email'
                placeholder='Ingrese el email'
                type='email'
              />

              <SelectFormField
                control={form.control}
                name='unidad'
                label='Unidad'
                placeholder='Seleccione una unidad'
                options={unidadesOptions}
              />

              <SelectFormField
                control={form.control}
                name='obra_principal'
                label='Obra Principal'
                placeholder='Seleccione la obra principal'
                options={obrasOptions}
              />

              <SelectFormField
                control={form.control}
                name='rol'
                label='Rol'
                placeholder='Seleccione un rol'
                options={rolesOptions}
              />

              <CheckboxFormField
                control={form.control}
                name='active'
                label='Usuario Activo'
                description='Indica si el usuario está activo en el sistema'
              />

              <MultiSelectFormField
                control={form.control}
                name='obras_permitidas'
                label='Obras Permitidas'
                placeholder='Selecciona las obras permitidas'
                options={obrasOptions}
              />

              <div className='flex justify-end space-x-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => navigate('/config/usuarios/view')}
                  disabled={updateUsuarioMutation.isPending}
                >
                  Cancelar
                </Button>

                <Button
                  type='submit'
                  className='flex items-center gap-2 bg-green-700 hover:bg-green-500'
                  disabled={updateUsuarioMutation.isPending}
                >
                  {updateUsuarioMutation.isPending && (
                    <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></span>
                  )}
                  {updateUsuarioMutation.isPending ? 'Guardando...' : 'Actualizar'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
