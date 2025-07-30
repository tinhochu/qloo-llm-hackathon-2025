import processTrip from '@/helpers/processTrip'
import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'
import Pusher from 'pusher'
import { Queue } from 'quirrel/next-app'

export const tripQueue = Queue('api/queues/trip', async (trip: any) => {
  try {
    await connectMongo()

    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    })

    pusher.trigger(`trip-${trip.id}`, 'trip.status.updated', {
      status: 'processing',
      message: 'Trip processing',
      tripId: trip.id,
    })

    // Update the trip status to processing
    await Trip.findByIdAndUpdate(trip.id, { $set: { status: 'processing' } })

    const response = await processTrip(trip.id)

    // Clean the JSON response by removing markdown code blocks and extra whitespace
    const itineraryText = response?.text
      ?.replace(/```json/g, '') // Remove opening ```json
      ?.replace(/```/g, '') // Remove closing ```
      ?.replace(/\n/g, '') // Remove newlines
      ?.trim() // Remove leading/trailing whitespace

    const itinerary = JSON.parse(itineraryText)

    await Trip.findByIdAndUpdate(trip.id, {
      $set: {
        status: 'completed',
        itinerary,
      },
    })

    // Update the trip status to completed
    pusher.trigger(`trip-${trip.id}`, 'trip.status.updated', {
      status: 'completed',
      message: 'Trip completed',
      tripId: trip.id,
    })

    console.log('👌 Trip completed', trip.id)
  } catch (error) {
    console.error(`Error processing trip ${trip.id}: ${error}`)
    // Re-throw the error to return the job to the queue
    throw error
  }
})
