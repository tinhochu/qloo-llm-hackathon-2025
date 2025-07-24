import { Button } from '@/components/ui/button'
import { ArrowRight, Plane } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="h-[calc(100vh-88px)] relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-24 sm:py-32">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Plane className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">Appmuseme</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Discover cities through
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              your tastes
            </span>
            , not TikToks
          </h1>

          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Get personalized travel recommendations based on your unique taste profile. No more generic tourist
            traps—discover places you'll actually love.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/plan">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg">
                Start Planning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 text-sm text-gray-300">✨ Privacy-first • 🎯 Taste-based • 🌍 Real local culture</div>
        </div>
      </div>
    </section>
  )
}
