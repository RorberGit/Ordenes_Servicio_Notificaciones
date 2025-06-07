import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
/* import App from './App' */
import { ThemeProvider } from './components/theme-provider'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '@/pages/layout/layout'
import { Ordenes } from './pages/OrdenesTrabajo'
import DashBoard from './pages/dashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashBoard />,
      },
      {
        path: 'order',
        element: <Ordenes />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
