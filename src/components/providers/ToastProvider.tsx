'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#FAF9F6', // warm-white
          color: '#000',
          border: '1px solid #E8E4D9', // soft-beige
        },
        success: {
          iconTheme: {
            primary: '#145B55', // deep-teal
            secondary: '#FAF9F6',
          },
        },
        error: {
          iconTheme: {
            primary: '#D04845', // terracotta-red
            secondary: '#FAF9F6',
          },
        },
      }}
    />
  )
}
