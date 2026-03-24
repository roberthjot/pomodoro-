import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          className: '!bg-white dark:!bg-neutral-900 !text-neutral-900 dark:!text-neutral-100 !shadow-lg !border !border-neutral-200 dark:!border-neutral-800 !rounded-xl !text-sm',
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
