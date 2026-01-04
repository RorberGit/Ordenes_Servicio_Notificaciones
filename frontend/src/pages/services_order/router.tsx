import FormNewOS from './new'
import ViewServiceOrder from './view'
import ServiceOrderDetails from './details'

const RouterOrderService = {
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
}

export default RouterOrderService
