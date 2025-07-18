import { Card, CardContent } from '@/components/ui/card'
import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'
import User from '@/models/User'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function TripsPage() {
  await connectMongo()
  const user = await currentUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const userObject = await User.findOne({ clerkId: user.id })

  if (!userObject) {
    return redirect('/sign-in')
  }

  const trips = await Trip.find({ userId: userObject._id })

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-br from-slate-50 to-blue-50 pb-12">
      <div className="w-full max-w-2xl mx-auto">
        <div className="container mx-auto px-4 py-8 lg:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Your Trips</h1>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
        {trips.map((trip) => (
          <Link href={`/trips/${trip._id}`} key={trip._id}>
            <Card>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-bold">{trip.destination}</h2>
                  <p className="text-sm text-gray-500">{trip.duration} days</p>
                  <p className="text-sm text-gray-500">{trip.season}</p>
                  <p className="text-sm text-gray-500">{trip.travelMood}</p>
                  <p className="text-sm text-gray-500">{trip.culturalPreferences.join(', ')}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
