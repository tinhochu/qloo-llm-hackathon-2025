import { DemoItinerary } from "@/components/demo-itinerary"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Demo: Tokyo Trip for a Jazz & Ramen Lover
            </h1>
            <p className="text-lg text-gray-600">
              See how CultureMatch creates personalized itineraries based on your unique taste profile
            </p>
          </div>

          <DemoItinerary />
        </div>
      </div>
    </div>
  )
}
