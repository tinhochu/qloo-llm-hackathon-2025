import { CTA } from '@/components/cta'
import { Features } from '@/components/features'
import Header from '@/components/header'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { Suspense } from 'react'

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Suspense>
          <Header />
        </Suspense>
        <Hero />
      </main>
    </>
  )
}
