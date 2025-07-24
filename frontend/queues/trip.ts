import processTrip from '@/helpers/processTrip'
import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'
import { Queue } from 'quirrel/next-app'

export const tripQueue = Queue('api/queues/trip', async (trip: any) => {
  try {
    await connectMongo()

    const response = await processTrip(trip)

    const QlooInsightsAgent = response.find((item: any) => item?.author === 'QlooInsightsAgent')

    const QlooInsightsAgentContent = QlooInsightsAgent?.content?.parts[0]?.text

    // Clean the JSON response by removing markdown code blocks and extra whitespace
    const QlooResponseCleaned = QlooInsightsAgentContent?.replace(/```json/g, '') // Remove opening ```json
      ?.replace(/```/g, '') // Remove closing ```
      ?.replace(/\n/g, '') // Remove newlines
      ?.trim() // Remove leading/trailing whitespace

    const QlooResponseJson = JSON.parse(QlooResponseCleaned)

    await Trip.findByIdAndUpdate(trip.id, {
      $set: {
        status: 'completed',
        itinerary: QlooResponseJson,
        itineraryText: QlooResponseCleaned,
      },
    })

    console.log('👌 Trip completed', trip.id)
  } catch (error) {
    console.error(`Error processing trip ${trip.id}: ${error}`)
    // Re-throw the error to return the job to the queue
    throw error
  }
})
