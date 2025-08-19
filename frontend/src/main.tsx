import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './globals.css'
/* import App from './App' */
import { ThemeProvider } from './components/theme-provider'
import Layout from '@/pages/layout/layout'
import { NewOrderService } from './pages/OrdenesTrabajo/nuevo'
import DashBoard from './pages/dashboard'
import { NotFound } from './pages/not_found/NoFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <DashBoard />,
      },
      {
        path: 'order',
        element: <NewOrderService />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
