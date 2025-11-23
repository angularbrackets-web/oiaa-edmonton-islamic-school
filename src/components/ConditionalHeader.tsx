'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'

export default function ConditionalHeader() {
  const pathname = usePathname()

  // Hide header on admin pages
  const isAdminPage = pathname?.startsWith('/admin')

  if (isAdminPage) {
    return null
  }

  return (
    <>
      <Header />
      <div className="pt-32" />
    </>
  )
}
