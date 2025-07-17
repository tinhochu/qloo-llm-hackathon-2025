import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-700">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to discover your perfect trip?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Stop following the crowd. Start following your taste. Create your first personalized travel itinerary in
            minutes.
          </p>
          <Link href="/plan">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
