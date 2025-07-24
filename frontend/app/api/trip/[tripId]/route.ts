import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ tripId: string }> }) {
  try {
    await connectMongo()

    const { tripId } = await params
    const trip = await Trip.findById(tripId)

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    // Convert the trip to a JSON object
    const tripData = await trip.toJSON()

    return NextResponse.json(tripData)
  } catch (error) {
    console.error('Error fetching Trip: [GET] /api/trip/[tripId]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
