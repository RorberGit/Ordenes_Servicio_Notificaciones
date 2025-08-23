import DashBoard from '@/pages/dashboard'
import Layout from '@/pages/layout/layout'
import { NotFound } from '@/pages/not_found/NoFound'
import { NewOrderService } from '@/pages/OrdenesTrabajo/nuevo'
import { createBrowserRouter } from 'react-router-dom'
import UpdateServiceOrder from '@/pages/services_order/update'
import ViewServiceOrder from '@/pages/services_order/view'
import NewServiceOrder from '@/pages/services_order/new'
import NotificationNew from '@/pages/notifications/new'
import NotificationUpdate from '@/pages/notifications/update'
import NotificationView from '@/pages/notifications/view'

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
        path: 'serviceorder',
        children: [
          {
            path: 'new',
            element: <NewServiceOrder />,
          },
          {
            path: 'update',
            element: <UpdateServiceOrder />,
          },
          {
            path: 'view',
            element: <ViewServiceOrder />,
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
            path: 'update',
            element: <NotificationUpdate />,
          },
          {
            path: 'view',
            element: <NotificationView />,
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
