import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MainForm from './pages/Main/MainForm/MainForm.jsx'
import Registr from './pages/Registration/Registration.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <MainForm/>
    <Registr/>
  </StrictMode>,
)
