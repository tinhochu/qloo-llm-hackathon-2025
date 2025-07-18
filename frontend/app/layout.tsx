import Header from '@/components/header'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import { Suspense } from 'react'

import './globals.css'

export const metadata: Metadata = {
  title: 'AppmuseMe',
  description: 'AppmuseMe',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn(GeistSans.className, GeistSans.variable, GeistMono.variable, 'antialiased')}>
          <main>
            <Suspense>
              <Header />
            </Suspense>
            {children}
          </main>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
