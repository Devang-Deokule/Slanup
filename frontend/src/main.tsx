import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#0B101B',
          color: '#fff',
          border: '1px solid #00B2A9',
        },
        success: {
          iconTheme: {
            primary: '#00B2A9',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff4444',
            secondary: '#fff',
          },
        },
      }}
    />
  </React.StrictMode>,
)

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err)
    })
  })
}

