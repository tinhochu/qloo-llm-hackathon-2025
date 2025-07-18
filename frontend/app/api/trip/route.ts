import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    console.log({ trip: data })

    return NextResponse.json({
      status: 'success',
      message: 'Trip created successfully',
      tripId: `trip_${Date.now()}`,
      destination: data.destination,
      duration: data.duration,
      isWeekendTrip: data.isWeekendTrip,
      season: data.season,
      travelMood: data.travelMood,
      culturalPreferences: data.culturalPreferences,
    })
  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
