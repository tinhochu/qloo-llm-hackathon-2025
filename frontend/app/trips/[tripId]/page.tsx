import { TravelItinerary } from '@/components/travel-itinerary'
import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Trip {
  id: string
  destination: string
  duration: string
  isWeekendTrip: boolean
  season: string
  travelMood: string
  culturalPreferences: string[]
  status: string
  createdAt: string
  updatedAt: string
}

interface TripPageProps {
  params: Promise<{ tripId: string }>
}

async function getTrip(tripId: string) {
  await connectMongo()

  const tripObject = await Trip.findById(tripId)

  if (!tripObject) {
    return notFound()
  }

  const trip = tripObject.toJSON()

  return trip
}

function BackButton() {
  return (
    <Link href="/trips" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8">
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Trips
    </Link>
  )
}

export default async function TripPage({ params }: TripPageProps) {
  const { tripId } = await params

  const trip = await getTrip(tripId)

  if (!trip) {
    return (
      <div className="h-[calc(100vh-88px)] bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Trip Not Found</h2>
            <p className="text-gray-600 mb-4">The trip you're looking for doesn't exist.</p>
            <BackButton />
          </div>
        </div>
      </div>
    )
  }

  if (trip.status === 'pending' || trip.status === 'processing') {
    return (
      <div className="h-[calc(100vh-88px)] bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full max-w-2xl mx-auto">
          <div className="container mx-auto px-4 py-8">
            <BackButton />

            <div className="max-w-4xl mx-auto text-center">
              <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Creating Your Perfect {trip.destination} Itinerary
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                We're analyzing your cultural preferences and crafting a personalized travel experience just for you.
              </p>
              <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-3">Trip Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Destination:</strong> {trip.destination}
                  </p>
                  <p>
                    <strong>Duration:</strong> {trip.duration}
                  </p>
                  <p>
                    <strong>Mood:</strong> {trip.travelMood}
                  </p>
                  <p>
                    <strong>Season:</strong> {trip.season}
                  </p>
                  <p>
                    <strong>Interests:</strong> {trip.culturalPreferences.join(', ')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                This usually takes a few minutes. You can refresh the page to check the status.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if trip failed
  if (trip.status === 'failed') {
    return (
      <div className="h-[calc(100vh-88px)] bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full max-w-2xl mx-auto">
          <div className="container mx-auto px-4 py-8">
            <BackButton />

            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Trip Creation Failed</h1>
              <p className="text-lg text-gray-600 mb-6">
                We encountered an issue while creating your itinerary. Please try planning a new trip.
              </p>
              <Link
                href="/trips"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Back to Trips
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-88px)] bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-2xl mx-auto">
        <div className="container mx-auto px-4 py-8">
          <BackButton />

          {/* <TravelItinerary travelPlan={travelPlan} /> */}
        </div>
      </div>
    </div>
  )
}
