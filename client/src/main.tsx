import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserTaskProvider } from './Context/UserTaskContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserTaskProvider>
        <App />
    </UserTaskProvider>
  </StrictMode>,
)
