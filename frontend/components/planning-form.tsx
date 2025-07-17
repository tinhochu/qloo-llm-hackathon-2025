"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, MapPin, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export function PlanningForm() {
  const [destination, setDestination] = useState("")
  const [tastes, setTastes] = useState("")
  const [duration, setDuration] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Store form data in sessionStorage for the results page
    sessionStorage.setItem(
      "travelPlan",
      JSON.stringify({
        destination,
        tastes,
        duration,
      }),
    )

    router.push("/results")
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-indigo-600" />
          Trip Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destination">Where are you going?</Label>
            <Input
              id="destination"
              placeholder="e.g., Tokyo, Paris, New York..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">How long is your trip?</Label>
            <Input
              id="duration"
              placeholder="e.g., 3 days, 1 week, weekend..."
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tastes" className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Tell us about your tastes
            </Label>
            <Textarea
              id="tastes"
              placeholder="I love acid jazz, wine bars, mid-century architecture, thrift shopping, sci-fi novels, quiet bookstores, authentic ramen, underground music venues..."
              value={tastes}
              onChange={(e) => setTastes(e.target.value)}
              rows={6}
              required
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              Be as specific as possible! Include music, food, books, architecture, activities, or anything that defines
              your taste.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Your Perfect Itinerary...
              </>
            ) : (
              "Generate My Itinerary"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
