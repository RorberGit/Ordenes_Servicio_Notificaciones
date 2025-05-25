import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App'
import { Ordenes } from './pages/OrdenesTrabajo'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Ordenes />
  </StrictMode>,
)
