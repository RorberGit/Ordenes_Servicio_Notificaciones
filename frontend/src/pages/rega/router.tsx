import FormInsertUpdateRega from './insertupdate'
import ViewRega from './view'
import RegaDetails from './details'

const RouterREGA = {
  path: 'rega',
  children: [
    {
      path: 'form',
      element: <FormInsertUpdateRega />,
    },
    {
      path: 'view',
      element: <ViewRega />,
    },
    {
      path: 'details/:id',
      element: <RegaDetails />,
    },
  ],
}

export default RouterREGA
