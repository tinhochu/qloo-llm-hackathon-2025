'use server'

import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'
import { tripQueue } from '@/queues/trip'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function regeneratePlan(formData: FormData) {
  try {
    await connectMongo()
    const tripId = formData.get('tripId') as string
    const tripObject = await Trip.findById(tripId)

    if (!tripObject) {
      throw new Error('Trip not found')
    }

    const trip = await tripObject.toJSON()

    await tripQueue.enqueue(trip)

    await Trip.findByIdAndUpdate(tripId, {
      status: 'pending',
    })

    revalidatePath(`/trips/${tripId}`)
  } catch (error) {
    console.error(error)
  }
}
