import NotificationDetails from './details'
import NotificationView from './view/index'
import NotificationNew from './new'

const RouterNotificaciones = {
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
}

export default RouterNotificaciones
