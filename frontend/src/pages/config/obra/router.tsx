import FormNewObra from './new'
import ViewObras from './view'
import ObraDetails from './details'

const RouterObra = {
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
}

export default RouterObra
