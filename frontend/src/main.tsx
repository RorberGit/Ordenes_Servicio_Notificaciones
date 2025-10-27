import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './globals.css'
import { ThemeProvider } from './components/theme-provider'
import { router } from './routes/router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProjectProvider>
          <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <RouterProvider router={router} />
            <Toaster richColors position='bottom-left' />
          </ThemeProvider>
        </ProjectProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
