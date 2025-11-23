import type { Metadata } from 'next'
import ToastProvider from '@/components/providers/ToastProvider'

export const metadata: Metadata = {
  title: 'Admin Dashboard - OIA Academy Edmonton',
  description: 'Admin dashboard for managing OIA Academy Edmonton website content',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ToastProvider />
    </>
  )
}
