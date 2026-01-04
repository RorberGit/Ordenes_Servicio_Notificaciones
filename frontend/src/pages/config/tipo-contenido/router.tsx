import ViewTipoContenido from './view'
import FormNewTipoContenido from './new'
import TipoContenidoDetails from './details'

const RouterTipoContenido = {
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
}

export default RouterTipoContenido
