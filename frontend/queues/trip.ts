import processTrip from '@/helpers/processTrip'
import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'
import { Queue } from 'quirrel/next-app'

export const tripQueue = Queue('api/queues/trip', async (trip: any) => {
  try {
    await connectMongo()

    const response = await processTrip(trip)

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
        itineraryText: response.text,
      },
    })

    console.log('👌 Trip completed', trip.id)
  } catch (error) {
    console.error(`Error processing trip ${trip.id}: ${error}`)
    // Re-throw the error to return the job to the queue
    throw error
  }
})
