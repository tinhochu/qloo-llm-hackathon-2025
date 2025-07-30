import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'
import { tripQueue } from '@/queues/trip'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // get the auth header
    const authHeader = request.headers.get('authorization')

    // if the auth header is not the cron secret, return an unauthorized error
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`)
      return new Response('Unauthorized', {
        status: 401,
      })

    // Connect to the database
    await connectMongo()

    // First check if we have some trips in the failed status
    const failedTrips = await Trip.find({ status: 'failed' })
    if (failedTrips && failedTrips.length > 0) {
      console.log(`Found ${failedTrips.length} failed trips`)
      // for each failed trip, delete the trip
      for (const trip of failedTrips) {
        await Trip.findByIdAndUpdate(trip.id, {
          $set: {
            status: 'pending',
            error: null,
            itineraryText: null,
          },
        })
      }
    }

    // Get all ideas
    const trips = await Trip.find({ status: { $in: ['pending', 'processing'] } }).sort({ createdAt: -1 })

    // if there is no ideas, return
    if (!trips || trips.length === 0) return Response.json({ success: true }, { status: 200 })

    console.log(`Enqueuing ${trips.length} trip${trips.length > 1 ? 's' : ''}...`)
    // for each trip, check if the trip is older than 1 hour
    for (const trip of trips) {
      const tripData = trip.toJSON()
      await tripQueue.enqueue({
        id: trip.id,
      })
    }

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
