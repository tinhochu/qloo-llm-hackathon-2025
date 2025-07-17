import { PlanningForm } from "@/components/planning-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PlanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Plan Your Perfect Trip</h1>
            <p className="text-lg text-gray-600">
              Tell us about your destination and tastes. We'll create a personalized itinerary just for you.
            </p>
          </div>

          <PlanningForm />
        </div>
      </div>
    </div>
  )
}
