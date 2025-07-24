import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import connectMongo from '@/lib/mongoose'
import { cn } from '@/lib/utils'
import Trip from '@/models/Trip'
import User from '@/models/User'
import { currentUser } from '@clerk/nextjs/server'
import { CheckIcon, Loader2Icon } from 'lucide-react'
import Link from 'next/link'

export default async function TripList({ tripId }: { tripId: string }) {
  await connectMongo()
  const clerkUser = await currentUser()
  const userObj = await User.findOne({ clerkId: clerkUser?.id })
  const user = userObj?.toJSON()

  const trips = await Trip.find({ userId: user.id })

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Trips</CardTitle>
      </CardHeader>
      <CardContent>
        {trips.length > 0 ? (
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
            {trips.map((trip) => (
              <Link
                href={`/trips/${trip.id}`}
                key={trip.id}
                className={cn(
                  'text-sm text-gray-500 flex items-center gap-2 p-2 rounded-md hover:bg-gray-100',
                  trip.id === tripId &&
                    'bg-gradient-to-r from-indigo-600 to-purple-600  text-white font-bold hover:bg-gradient-to-r hover:from-indigo-700 hover:to-purple-700'
                )}
              >
                {trip.status === 'pending' ? <Loader2Icon className="w-4 h-4 animate-spin" /> : null}
                {trip.status === 'processing' ? <Loader2Icon className="w-4 h-4 animate-spin" /> : null}
                {trip.status === 'completed' ? <CheckIcon className="w-4 h-4" /> : null}
                {trip.destination}
              </Link>
            ))}
          </div>
        ) : (
          <>
            <div className="text-sm text-gray-500">No trips found</div>
            <div className="text-sm text-gray-500">
              <Link href="/trips">Create a new trip</Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
