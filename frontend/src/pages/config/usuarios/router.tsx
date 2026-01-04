import ViewUsuarios from './view'
import UsuarioDetails from './details'
import FormEditUsuario from './new'

const RouterUsuarios = {
  path: 'usuarios',
  children: [
    {
      path: 'view',
      element: <ViewUsuarios />,
    },
    {
      path: 'form/:id',
      element: <FormEditUsuario />,
    },
    {
      path: 'details/:id',
      element: <UsuarioDetails />,
    },
  ],
}

export default RouterUsuarios
