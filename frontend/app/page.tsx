import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { CTA } from "@/components/cta"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </main>
  )
}
