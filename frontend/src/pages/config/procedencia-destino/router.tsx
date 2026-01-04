import ViewProcedenciaDestino from './view'
import FormNewProcedenciaDestino from './new'
import ProcedenciaDestinoDetails from './details'

const RouterProcedimientosDestinos = {
  path: 'procedencia-destino',
  children: [
    {
      path: 'view',
      element: <ViewProcedenciaDestino />,
    },
    {
      path: 'new',
      element: <FormNewProcedenciaDestino />,
    },
    {
      path: 'details/:id',
      element: <ProcedenciaDestinoDetails />,
    },
  ],
}

export default RouterProcedimientosDestinos
