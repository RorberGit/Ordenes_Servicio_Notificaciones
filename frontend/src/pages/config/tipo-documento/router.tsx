import ViewTipoDocumento from './view'
import FormNewTipoDocumento from './new'
import TipoDocumentoDetails from './details'

const RouterTipoDocumentos = {
  path: 'tipo-documento',
  children: [
    {
      path: 'view',
      element: <ViewTipoDocumento />,
    },
    {
      path: 'new',
      element: <FormNewTipoDocumento />,
    },
    {
      path: 'details/:id',
      element: <TipoDocumentoDetails />,
    },
  ],
}

export default RouterTipoDocumentos
