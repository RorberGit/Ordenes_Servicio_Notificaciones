import ViewEspecialidades from './view'
import FormNewEspecialidad from './new'
import EspecialidadDetails from './details'

const RouterEspecialidades = {
  path: 'especialidades',
  children: [
    {
      path: 'view',
      element: <ViewEspecialidades />,
    },
    {
      path: 'new',
      element: <FormNewEspecialidad />,
    },
    {
      path: 'details/:id',
      element: <EspecialidadDetails />,
    },
  ],
}

export default RouterEspecialidades
