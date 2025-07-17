"use client"

import { useEffect, useState } from "react"
import { TravelItinerary } from "@/components/travel-itinerary"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface TravelPlan {
  destination: string
  tastes: string
  duration: string
}

export default function ResultsPage() {
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedPlan = sessionStorage.getItem("travelPlan")
    if (storedPlan) {
      setTravelPlan(JSON.parse(storedPlan))
      // Simulate processing time
      setTimeout(() => setIsLoading(false), 1500)
    } else {
      router.push("/plan")
    }
  }, [router])

  if (isLoading || !travelPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Crafting Your Perfect Itinerary</h2>
          <p className="text-gray-600">Analyzing your tastes and finding the best local spots...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/plan" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Plan Another Trip
        </Link>

        <TravelItinerary travelPlan={travelPlan} />
      </div>
    </div>
  )
}
