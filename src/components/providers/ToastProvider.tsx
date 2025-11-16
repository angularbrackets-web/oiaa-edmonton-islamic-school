'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#1a3a3a',
          border: '1px solid #e8dcc4',
        },
        success: {
          iconTheme: {
            primary: '#2C5F4F',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#D4705B',
            secondary: '#fff',
          },
        },
      }}
    />
  )
}
