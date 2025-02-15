import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider } from './contexts/authContext.jsx'
import './index.css'
import App from './App.jsx'
import {Toaster} from 'sonner'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
     <Toaster position='top-center' richColors/>
      <AuthProvider>
         <App />
      </AuthProvider>  
  </BrowserRouter>
  
)
