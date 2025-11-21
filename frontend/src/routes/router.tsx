import DashBoard from '../pages/dashboard/index'
import Layout from '../pages/layout/layout'
import { NotFound } from '../pages/NoFound'
import { createBrowserRouter } from 'react-router-dom'
import ViewServiceOrder from '../pages/services_order/view/index'
import ServiceOrderDetails from '../pages/services_order/details/index'
import FormNewOS from '../pages/services_order/new/index'
import NotificationNew from '../pages/notifications/new/index'
import NotificationView from '../pages/notifications/view/index'
import { ProtectedRoute } from './ProtectedRoute'
import Login from '@/pages/login/login'
import { Unauthorized } from '@/pages/unauthorized'
import NotificationDetails from '@/pages/notifications/details/index'
import SelectWork from '@/pages/work/select/index'
import ViewObras from '@/pages/config/obra/view/index'
import FormNewObra from '@/pages/config/obra/new/index'
import ObraDetails from '@/pages/config/obra/details/index'
import ViewEspecialidades from '@/pages/config/especialidades/view/index'
import FormNewEspecialidad from '@/pages/config/especialidades/new/index'
import EspecialidadDetails from '@/pages/config/especialidades/details/index'
import ViewTipoContenido from '@/pages/config/tipo-contenido/view/index'
import FormNewTipoContenido from '@/pages/config/tipo-contenido/new/index'
import TipoContenidoDetails from '@/pages/config/tipo-contenido/details/index'
import ViewUsuarios from '@/pages/config/usuarios/view/index'
import FormEditUsuario from '@/pages/config/usuarios/new/index'
import UsuarioDetails from '@/pages/config/usuarios/details/index'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <DashBoard />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />,
      },
      {
        element: <ProtectedRoute allowedRoles={['Administrador', 'Especialistas', 'A.Juridico']} />,
        children: [
          {
            path: 'serviceorder',
            children: [
              {
                path: 'new',
                element: <FormNewOS />,
              },
              {
                path: 'view',
                element: <ViewServiceOrder />,
              },
              {
                path: 'details/:id',
                element: <ServiceOrderDetails />,
              },
            ],
          },
          {
            path: 'notifications',
            children: [
              {
                path: 'new',
                element: <NotificationNew />,
              },
              {
                path: 'view',
                element: <NotificationView />,
              },
              {
                path: 'details/:id',
                element: <NotificationDetails />,
              },
            ],
          },
          {
            path: 'work',
            children: [
              {
                path: 'select',
                element: <SelectWork />,
              },
            ],
          },
        ],
      },
      {
        path: 'config',
        children: [
          {
            path: 'obra',
            children: [
              {
                path: 'view',
                element: <ViewObras />,
              },
              {
                path: 'new',
                element: <FormNewObra />,
              },
              {
                path: 'details/:id',
                element: <ObraDetails />,
              },
            ],
          },
          {
            path: 'especialidades',
            children: [
              {
                path: 'view',
                element: <ViewEspecialidades />,
              },
              {
                path: 'new',
                element: <FormNewEspecialidad />,
              },
              {
                path: 'details/:id',
                element: <EspecialidadDetails />,
              },
            ],
          },
          {
            path: 'tipo-contenido',
            children: [
              {
                path: 'view',
                element: <ViewTipoContenido />,
              },
              {
                path: 'new',
                element: <FormNewTipoContenido />,
              },
              {
                path: 'details/:id',
                element: <TipoContenidoDetails />,
              },
            ],
          },
          {
            path: 'usuarios',
            children: [
              {
                path: 'view',
                element: <ViewUsuarios />,
              },
              {
                path: 'edit/:id',
                element: <FormEditUsuario />,
              },
              {
                path: 'details/:id',
                element: <UsuarioDetails />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
