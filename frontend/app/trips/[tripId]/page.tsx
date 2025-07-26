import { regeneratePlan } from '@/app/actions'
import Map from '@/components/city-map'
import { CulturalPreferencesBadge } from '@/components/cultural-preferences-badge'
import { EntityImage, EntityImageLoading } from '@/components/entity-image'
import GPTTypingEffect from '@/components/gpt-typing-effect'
import { SeasonBadge } from '@/components/season-badge'
import TripDetailsLoading from '@/components/trip-details-loading'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isEntityIdValid } from '@/helpers/qloo'
import connectMongo from '@/lib/mongoose'
import { cn } from '@/lib/utils'
import Trip from '@/models/Trip'
import User from '@/models/User'
import { auth } from '@clerk/nextjs/server'
import { ArrowLeft, Loader2 } from 'lucide-react'
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
        <Card className="p-0 overflow-hidden">
          <CardContent className="overflow-hidden p-0">
            <Map lat={trip.coords.lat} lng={trip.coords.lon} />
          </CardContent>
        </Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Itinerary</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-day-1">
              {trip.itinerary?.itinerary &&
                Object.entries(trip.itinerary.itinerary).map(([dayTitle, dayData]) => (
                  <AccordionItem value={`item-${dayTitle.replace(' ', '-').toLowerCase()}`} key={dayTitle}>
                    <AccordionTrigger className="font-semibold text-gray-900 mb-3 hover:cursor-pointer">
                      {dayTitle}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {(dayData as any[]).map((item, index) => (
                          <div key={index} className="border-l-4 border-indigo-200 pl-4 py-2">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                {item.time}
                              </span>
                            </div>
                            {item.recommendation && (
                              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                  <div
                                    className={cn(
                                      'col-span-1',
                                      isEntityIdValid(item.recommendation.entity_id) ? 'lg:col-span-2' : 'lg:col-span-3'
                                    )}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className="text-2xl">
                                        {item.recommendation.type === 'restaurant' && '🍽️'}
                                        {item.recommendation.type === 'attraction' && '🏛️'}
                                        {item.recommendation.type === 'venue' && '🎹'}
                                        {item.recommendation.type === 'hotel' && '🏨'}
                                        {item.recommendation.type === 'activity' && '🎯'}
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                          {item.recommendation.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                          <span className="capitalize">{item.recommendation.type}</span>
                                          <span>•</span>
                                          <span>{item.recommendation.location}</span>
                                          {item.recommendation.rating && (
                                            <>
                                              <span>•</span>
                                              <span className="flex items-center gap-1">
                                                ⭐ {item.recommendation.rating}
                                              </span>
                                            </>
                                          )}
                                        </div>
                                        <p className="text-gray-700 mb-3">{item.recommendation.description}</p>

                                        {item.recommendation.cultural_match &&
                                          item.recommendation.cultural_match.length > 0 && (
                                            <div className="mb-3">
                                              <span className="text-sm font-medium text-gray-600">Cultural Match:</span>
                                              <div className="flex flex-wrap gap-1 mt-1">
                                                {item.recommendation.cultural_match.map(
                                                  (match: string, matchIndex: number) => (
                                                    <span
                                                      key={matchIndex}
                                                      className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
                                                    >
                                                      {match}
                                                    </span>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}

                                        {item.recommendation.why_recommended && (
                                          <div className="mb-3">
                                            <span className="text-sm font-medium text-gray-600">Why Recommended:</span>
                                            <p className="text-sm text-gray-700 mt-1">
                                              {item.recommendation.why_recommended}
                                            </p>
                                          </div>
                                        )}

                                        {item.recommendation.weather_consideration && (
                                          <div>
                                            <span className="text-sm font-medium text-gray-600">
                                              Weather Consideration:
                                            </span>
                                            <p className="text-sm text-gray-700 mt-1">
                                              {item.recommendation.weather_consideration}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {isEntityIdValid(item.recommendation.entity_id) && (
                                    <div className="col-span-1">
                                      <Suspense fallback={<EntityImageLoading />}>
                                        <EntityImage entityId={item.recommendation.entity_id} />
                                      </Suspense>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
