import ViewUnidad from './view'
import FormNewUnidad from './new'
import UnidadDetails from './details'

const RouterUnidad = {
  path: 'unidad',
  children: [
    {
      path: 'view',
      element: <ViewUnidad />,
    },
    {
      path: 'new',
      element: <FormNewUnidad />,
    },
    {
      path: 'details/:id',
      element: <UnidadDetails />,
    },
  ],
}

export default RouterUnidad
