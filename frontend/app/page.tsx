import Header from '@/components/header'
import { Hero } from '@/components/hero'
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
