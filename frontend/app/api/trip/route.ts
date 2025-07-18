import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'
import User from '@/models/User'
import { tripQueue } from '@/queues/trip'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await connectMongo()

    // get the data from the request
    const data = await req.json()

    // Find the User with userId from Clerk
    const user = await User.findOne({ clerkId: data.userId })

    // create the trip
    const tripObject = await Trip.create({
      userId: user._id, // user._id is the ObjectId of the user
      destination: data.destination,
      duration: data.duration,
      isWeekendTrip: data.isWeekendTrip,
      season: data.season,
      travelMood: data.travelMood,
      culturalPreferences: data.culturalPreferences,
    })

    // convert the trip to a JSON object
    const trip = await tripObject.toJSON()

    // enqueue the trip
    await tripQueue.enqueue(trip)

    // return the trip id
    return NextResponse.json({
      status: 'success',
      message: 'Trip created successfully',
      tripId: trip.id,
    })
  } catch (error) {
    console.error('Error creating Trip: [POST] /api/trip', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
