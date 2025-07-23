import processTrip from '@/helpers/processTrip'
import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'
import Pusher from 'pusher'
import { Queue } from 'quirrel/next-app'

export const tripQueue = Queue('api/queues/trip', async (trip: any) => {
  try {
    await connectMongo()

    const response = await processTrip(trip)

    const qlooInsightsAgent = response?.find((item: any) => item?.author === 'QlooInsightsAgent')
    const weatherAgent = response?.find((item: any) => item?.author === 'WeatherAgent')

    const jsonData = qlooInsightsAgent.content?.parts[0]?.text.replace(/```json\n|```/g, '')
    const generatedItinerary = JSON.parse(jsonData)
    const weather = weatherAgent.content?.parts[0]?.text.replace(/```json\n|```/g, '')
    const weatherJson = JSON.parse(weather)

    await Trip.findByIdAndUpdate(trip.id, {
      $set: { status: 'completed', itinerary: generatedItinerary, weather: weatherJson },
    })

    console.log('👌 Trip completed', trip.id)
  } catch (error) {
    console.error(`Error processing trip ${trip.id}: ${error}`)
  }
})
