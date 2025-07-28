import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/lib/providers/query-provider'
import { ToastProvider } from '@/lib/providers/toast-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Travel Platform - Plan Your Perfect Trip',
  description: 'Book flights, hotels, and activities for your dream vacation',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <ToastProvider />
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
