import processTrip from '@/helpers/processTrip'
import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'
import Pusher from 'pusher'
import { Queue } from 'quirrel/next-app'

export const tripQueue = Queue('api/queues/trip', async (trip: any) => {
  try {
    await connectMongo()
    // const pusher = new Pusher({
    //   appId: process.env.PUSHER_APP_ID!,
    //   key: process.env.PUSHER_KEY!,
    //   secret: process.env.PUSHER_SECRET!,
    //   cluster: 'us2',
    //   useTLS: true,
    // })

    const response = await processTrip(trip)

    // // find in the Array the author 'ContentPackagerAgent'
    // const contentPackagerAgent = response?.find((item: any) => item?.author === 'ContentPackagerAgent')

    // // if there is no contentPackagerAgent, return
    // if (!contentPackagerAgent) {
    //   return
    // }

    // const jsonData = contentPackagerAgent.content?.parts[0]?.text.replace(/```json\n|```/g, '')
    // const generatedPackage = JSON.parse(jsonData)

    // update the idea with the generated package

    await Trip.findByIdAndUpdate(trip.id, { $set: { status: 'completed' } })

    // pusher.trigger(`task-${trip.id}`, 'task.status.updated', {
    //   status: 'completed',
    //   message: 'Trip completed',
    //   tripId: trip.id,
    // })

    console.log('👌 Trip completed', trip.id)
  } catch (error) {
    console.error(`Error processing trip ${trip.id}: ${error}`)
  }
})
