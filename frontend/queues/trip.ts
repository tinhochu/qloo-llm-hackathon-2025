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

    // Improved JSON parsing with better error handling
    let itineraryText = response?.text || ''

    await Trip.findByIdAndUpdate(trip.id, {
      $set: {
        itineraryText: response?.text,
      },
    })

    // Remove markdown code blocks and clean the text
    itineraryText = itineraryText
      .replace(/```json\s*/g, '') // Remove opening ```json
      .replace(/```\s*$/g, '') // Remove closing ```
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim() // Remove leading/trailing whitespace

    // Try to find JSON content if it's wrapped in other text
    const jsonMatch = itineraryText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      itineraryText = jsonMatch[0]
    }

    let itinerary
    try {
      itinerary = JSON.parse(itineraryText)
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError)
      console.error('Raw text length:', itineraryText.length)
      console.error('Raw text preview:', itineraryText.substring(0, 500))

      // Try to fix common JSON issues
      const fixedText = itineraryText
        .replace(/,\s*}/g, '}') // Remove trailing commas
        .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
        .replace(/\\"/g, '"') // Fix escaped quotes
        .replace(/\\n/g, ' ') // Replace escaped newlines
        .replace(/\\t/g, ' ') // Replace escaped tabs

      try {
        itinerary = JSON.parse(fixedText)
      } catch (secondError) {
        console.error('Second JSON parsing attempt failed:', secondError)
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError)
        throw new Error(`Failed to parse itinerary JSON: ${errorMessage}. Text length: ${itineraryText.length}`)
      }
    }

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

    // Update trip status to failed
    try {
      await Trip.findByIdAndUpdate(trip.id, {
        $set: {
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
        },
      })
    } catch (updateError) {
      console.error('Failed to update trip status to failed:', updateError)
    }

    // Re-throw the error to return the job to the queue
    throw error
  }
})
