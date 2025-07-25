import Header from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import { Suspense } from 'react'

import './globals.css'

export const metadata: Metadata = {
  title: 'Appmuseme',
  description: 'Appmuseme',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            GeistSans.className,
            GeistSans.variable,
            GeistMono.variable,
            'antialiased bg-gradient-to-br from-slate-50 to-blue-50'
          )}
        >
          {children}
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
