"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Coffee, Utensils, Music, BookOpen, ShoppingBag, Camera, Download, Share2, Heart } from "lucide-react"

interface TravelPlan {
  destination: string
  tastes: string
  duration: string
}

interface ItineraryProps {
  travelPlan: TravelPlan
}

export function TravelItinerary({ travelPlan }: ItineraryProps) {
  // Mock data based on the example in the prompt
  const itinerary = {
    destination: travelPlan.destination,
    duration: travelPlan.duration,
    tasteProfile: travelPlan.tastes
      .split(",")
      .map((taste) => taste.trim())
      .slice(0, 5),
    days: [
      {
        day: 1,
        theme: "Cultural Immersion",
        activities: [
          {
            time: "9:00 AM",
            type: "breakfast",
            icon: Coffee,
            title: "Blue Seal Coffee",
            location: "Shimokitazawa",
            description: "Jazz café with live morning sessions and artisanal coffee. Perfect for acid jazz lovers.",
            match: "Acid jazz, coffee culture",
          },
          {
            time: "11:00 AM",
            type: "culture",
            icon: BookOpen,
            title: "Village Vanguard",
            location: "Koenji",
            description: "Quirky bookstore with sci-fi section and underground zines. A paradise for book lovers.",
            match: "Sci-fi novels, indie books",
          },
          {
            time: "2:00 PM",
            type: "shopping",
            icon: ShoppingBag,
            title: "Flamingo Vintage",
            location: "Harajuku",
            description: "Curated vintage clothing with mid-century pieces and unique finds.",
            match: "Thrift shopping, vintage style",
          },
          {
            time: "7:00 PM",
            type: "dining",
            icon: Utensils,
            title: "Menya Saimi",
            location: "Shibuya",
            description: "Hidden ramen shop known only to locals. No tourists, just authentic flavors.",
            match: "Authentic ramen, local culture",
          },
          {
            time: "9:30 PM",
            type: "nightlife",
            icon: Music,
            title: "Jazz Spot Intro",
            location: "Shinjuku",
            description: "Intimate basement jazz bar featuring acid jazz and experimental sounds.",
            match: "Acid jazz, underground venues",
          },
        ],
      },
      {
        day: 2,
        theme: "Hidden Neighborhoods",
        activities: [
          {
            time: "10:00 AM",
            type: "breakfast",
            icon: Coffee,
            title: "Café de l'Ambre",
            location: "Ginza",
            description: "Historic coffee house with aged beans and quiet reading corners.",
            match: "Quiet spaces, coffee culture",
          },
          {
            time: "12:00 PM",
            type: "culture",
            icon: Camera,
            title: "Nezu Shrine",
            location: "Nezu",
            description: "Peaceful shrine with traditional architecture, away from crowds.",
            match: "Architecture, quiet spaces",
          },
          {
            time: "3:00 PM",
            type: "shopping",
            icon: BookOpen,
            title: "Tsutaya Books",
            location: "Daikanyama",
            description: "Design-focused bookstore with international sci-fi and architecture books.",
            match: "Books, architecture, design",
          },
          {
            time: "6:00 PM",
            type: "dining",
            icon: Utensils,
            title: "Kozasa",
            location: "Ebisu",
            description: "Intimate wine bar with natural wines and small plates.",
            match: "Wine bars, intimate settings",
          },
        ],
      },
    ],
    extras: {
      playlist: "Tokyo Acid Jazz Vibes",
      culturalPrimer: "Haruki Murakami novels, Tokyo architecture guide",
      localTips: "Download the Hyperdia app for trains, carry cash, bow slightly when greeting",
    },
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "breakfast":
        return Coffee
      case "culture":
        return Camera
      case "shopping":
        return ShoppingBag
      case "dining":
        return Utensils
      case "nightlife":
        return Music
      default:
        return MapPin
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "breakfast":
        return "bg-amber-100 text-amber-800"
      case "culture":
        return "bg-purple-100 text-purple-800"
      case "shopping":
        return "bg-pink-100 text-pink-800"
      case "dining":
        return "bg-green-100 text-green-800"
      case "nightlife":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">Your Perfect {itinerary.destination} Trip</CardTitle>
              <p className="text-indigo-100">{itinerary.duration} • Personalized for your taste</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="secondary" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {itinerary.tasteProfile.map((taste, index) => (
              <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                {taste}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      {itinerary.days.map((day) => (
        <Card key={day.day} className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                {day.day}
              </div>
              Day {day.day}: {day.theme}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {day.activities.map((activity, index) => {
                const IconComponent = activity.icon
                return (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="text-sm font-medium text-gray-600 mt-2">{activity.time}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-lg text-gray-900">{activity.title}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {activity.location}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{activity.description}</p>
                      <div className="flex items-center gap-2">
                        <Heart className="h-3 w-3 text-red-500" />
                        <span className="text-sm text-gray-500">Matches: {activity.match}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Extras */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-green-600" />
              Spotify Playlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">Get in the vibe with curated music that matches your taste</p>
            <Button variant="outline" className="w-full bg-transparent">
              🎧 {itinerary.extras.playlist}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Cultural Primer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">Recommended reading and cultural context</p>
            <p className="text-sm text-gray-700">📚 {itinerary.extras.culturalPrimer}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              Local Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-3">Insider knowledge for your trip</p>
            <p className="text-sm text-gray-700">💡 {itinerary.extras.localTips}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
