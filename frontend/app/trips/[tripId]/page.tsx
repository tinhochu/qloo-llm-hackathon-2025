import { regeneratePlan } from '@/app/actions'
import Map from '@/components/city-map'
import { CulturalPreferencesBadge } from '@/components/cultural-preferences-badge'
import GPTTypingEffect from '@/components/gpt-typing-effect'
import { SeasonBadge } from '@/components/season-badge'
import TripDetailsLoading from '@/components/trip-details-loading'
import { TripItineraryItem } from '@/components/trip-itinerary-item'
import { TripItinerarySkeleton } from '@/components/trip-itinerary-skeleton'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { batchApiCalls, getEntityImageData, getInstagramData, getTikTokData } from '@/lib/api-utils'
import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'
import User from '@/models/User'
import { auth } from '@clerk/nextjs/server'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Suspense } from 'react'

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

export async function generateMetadata({ params }: TripPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const tripId = (await params).tripId

  // fetch post information
  const post = await getTrip(tripId)

  return {
    title: `Appmuseme - ${post.destination} for ${post.duration} days`,
  }
}

// Async component for the itinerary section
async function TripItinerary({ trip }: { trip: any }) {
  // Get all items that need API calls
  const allItems = (trip.itinerary?.itinerary ? Object.entries(trip.itinerary.itinerary) : []).flatMap(
    ([dayTitle, dayData]) => (dayData as any[]).map((item) => ({ ...item, dayTitle }))
  )

  // Batch API calls for better performance
  const [tiktokResults, instagramResults, entityImageResults] = await Promise.allSettled([
    batchApiCalls(allItems, getTikTokData, 3),
    batchApiCalls(allItems, getInstagramData, 3),
    batchApiCalls(
      allItems.filter((item) => item.recommendation?.entity_id),
      (item) => getEntityImageData(item.recommendation.entity_id),
      3
    ),
  ])

  // Reconstruct the itinerary with the fetched data
  const itineraryWithData = (trip.itinerary?.itinerary ? Object.entries(trip.itinerary.itinerary) : []).map(
    ([dayTitle, dayData]) => {
      const dayItems = (dayData as any[]).map((item, itemIndex) => {
        const globalIndex = allItems.findIndex(
          (globalItem) => globalItem.time === item.time && globalItem.recommendation?.name === item.recommendation?.name
        )

        const tiktokData =
          tiktokResults.status === 'fulfilled' && globalIndex >= 0 ? tiktokResults.value[globalIndex] : null

        const instagramData =
          instagramResults.status === 'fulfilled' && globalIndex >= 0 ? instagramResults.value[globalIndex] : null

        const entityImageData =
          entityImageResults.status === 'fulfilled' && globalIndex >= 0 ? entityImageResults.value[globalIndex] : null

        return {
          ...item,
          tiktokData,
          instagramData,
          entityImageData,
        }
      })

      return {
        dayTitle,
        dayData: dayItems,
      }
    }
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-day-1">
          {itineraryWithData.map(({ dayTitle, dayData }) => (
            <AccordionItem value={`item-${dayTitle.replace(' ', '-').toLowerCase()}`} key={dayTitle}>
              <AccordionTrigger className="font-semibold text-gray-900 mb-3 hover:cursor-pointer">
                {dayTitle}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {dayData.map((item: any, index: number) => (
                    <TripItineraryItem key={index} item={item} index={index} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

export default async function TripPage({ params }: TripPageProps) {
  const { tripId } = await params
  const { userId } = await auth()

  const UserObject = await User.findOne({ clerkId: userId })
  const user = UserObject?.toJSON()
  const trip = await getTrip(tripId)

  if (trip.userId.toString() !== user.id.toString()) {
    redirect('/plan')
  }

  if (!trip) {
    return (
      <div className="h-[calc(100vh-88px)] bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Trip Not Found</h2>
            <p className="text-gray-600 mb-4">{"The trip you're looking for doesn't exist."}</p>
            <BackButton />
          </div>
        </div>
      </div>
    )
  }

  if (trip.status === 'pending' || trip.status === 'processing') {
    return <TripDetailsLoading trip={trip} />
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="col-span-3 flex flex-col gap-4">
        <div className="flex flex-col lg:grid lg:grid-cols-3 lg:flex-row gap-2">
          <div className="col-span-1 lg:col-span-2">
            <div className="text-2xl font-bold">
              {trip.destination} for {trip.duration} days
              <div className="flex items-center gap-2 mt-2">
                <SeasonBadge season={trip.season} />
                <CulturalPreferencesBadge culturalPreferences={trip.culturalPreferences} />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex items-center lg:justify-end gap-2">
              <form action={regeneratePlan}>
                <input type="hidden" name="tripId" value={tripId} />
                <Button size="sm" variant="outline">
                  Regenerate
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
            <Card className="gap-0">
              <CardHeader>
                <CardTitle>Weather</CardTitle>
              </CardHeader>
              <CardContent>
                <GPTTypingEffect text={trip?.itinerary?.trip_context?.weather_forecast} />
              </CardContent>
            </Card>
            <Card className="gap-0">
              <CardHeader>
                <CardTitle>Cultural Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <GPTTypingEffect text={trip?.itinerary?.entity_summary?.cultural_insights} />
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1">
            <Card className="p-0 overflow-hidden">
              <CardContent className="overflow-hidden p-0">
                <Map lat={trip.coords.lat} lng={trip.coords.lon} />
              </CardContent>
            </Card>
          </div>
        </div>

        <Suspense fallback={<TripItinerarySkeleton />}>
          <TripItinerary trip={trip} />
        </Suspense>
      </div>
    </div>
  )
}
