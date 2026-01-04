import DashBoard from '../pages/dashboard/index'
import Layout from '../pages/layout/layout'
import { NotFound } from '../pages/NoFound'
import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import Login from '@/pages/login/login'
import { Unauthorized } from '@/pages/unauthorized'
import RouterNotificaciones from '@/pages/notifications/router'
import RouterOrderService from '@/pages/services_order/router'
import RouterUnidad from '@/pages/config/unidad/router'
import RouterREGA from '@/pages/rega/router'
import RouterUsuarios from '@/pages/config/usuarios/router'
import RouterEspecialidades from '@/pages/config/especialidades/router'
import RouterObra from '@/pages/config/obra/router'
import RouterProcedimientosDestinos from '@/pages/config/procedencia-destino/router'
import RouterTipoContenido from '@/pages/config/tipo-contenido/router'
import RouterTipoDocumentos from '@/pages/config/tipo-documento/router'
import RouterWork from '@/pages/work/select/router'

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
        children: [RouterOrderService, RouterNotificaciones, RouterWork, RouterREGA],
      },
      {
        path: 'config',
        children: [
          RouterUnidad,
          RouterObra,
          RouterEspecialidades,
          RouterTipoDocumentos,
          RouterTipoContenido,
          RouterProcedimientosDestinos,
          RouterUsuarios,
        ],
      },
      /*       {
        path: '*',
        element: <NotFound />,
      }, */
    ],
  },
])
