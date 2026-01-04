import SelectWork from '.'

const RouterWork = {
  path: 'work',
  children: [
    {
      path: 'select',
      element: <SelectWork />,
    },
  ],
}

export default RouterWork
