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
import Login from '@/pages/login'
import { Unauthorized } from '@/pages/unauthorized'
import NotificationDetails from '@/pages/notifications/details/index'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    /*  errorElement: <NotFound />, */
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
        path: 'serviceorder',
        children: [
          {
            path: 'new',
            element: (
              <ProtectedRoute>
                <FormNewOS />
              </ProtectedRoute>
            ),
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
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])
