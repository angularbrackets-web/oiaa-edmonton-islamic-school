import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import ToastProvider from '@/components/providers/ToastProvider'

export const metadata: Metadata = {
  title: 'OIA Academy Edmonton - Islamic School',
  description: 'A beautiful modern Islamic school providing quality education with Islamic values',
  keywords: ['Islamic School', 'Education', 'Edmonton', 'Academy', 'Muslim'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="pt-32">
          {children}
        </div>
        <ToastProvider />
      </body>
    </html>
  )
}