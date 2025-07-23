import connectMongo from '@/lib/mongoose'
import Trip from '@/models/Trip'

/**
 * Get the coordinates from a location using the OpenWeather API
 * @param location - The location to get the coordinates from
 * @returns The coordinates of the location
 */
const getCoordsfromLocation = async (location: string) => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.OPENWEATHER_API_KEY!}`
  )
  const data = await response.json()
  return data[0]
}

const getQlooTags = async (trip: any): Promise<string[]> => {
  // Make all requests in parallel
  const tagPromises = trip.culturalPreferences.map(async (culturalPreference: string) => {
    const response = await fetch(`${process.env.QLOO_API_URL!}/v2/tags?filter.query=${culturalPreference}`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.QLOO_API_KEY!,
      },
    })

    const data = await response.json()
    return data.results?.tags || []
  })

  // Wait for all requests to complete and merge results
  const allTagResults = await Promise.all(tagPromises)
  const mergedTags = allTagResults.flat()

  // remove duplicates
  const uniqueTags = [...new Set(mergedTags.map((tag: any) => tag.id))]

  return uniqueTags
}

const getQlooEntities = async (trip: any, coords: { lat: number; lon: number }): Promise<string[]> => {
  // Make all requests in parallel
  const entityPromises = trip.culturalPreferences.map(async (culturalPreference: string) => {
    const response = await fetch(
      `${process.env.QLOO_API_URL!}/search?query=${culturalPreference}&filter.location=${coords.lat},${coords.lon}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': process.env.QLOO_API_KEY!,
        },
      }
    )

    const data = await response.json()
    return data?.results || []
  })

  const allEntityResults = await Promise.all(entityPromises)
  const mergedEntities = allEntityResults.flat()

  // remove duplicates
  const uniqueEntities = [...new Set(mergedEntities.map((entity: any) => entity.entity_id))]

  return uniqueEntities
}

export default async function processTrip(trip: any) {
  try {
    await connectMongo()

    // get the coordinates from the location
    const coords = await getCoordsfromLocation(trip.destination)

    // get the qloo tags
    const qlooTags = await getQlooTags(trip)

    const qlooEntities = await getQlooEntities(trip, coords)

    // update the trip with the qloo tags
    const updatedTrip = await Trip.findByIdAndUpdate(trip.id, {
      $set: { qlooTags, qlooEntities, coords: { lat: coords.lat, lon: coords.lon } },
    })

    // create the session
    const responseSession = await fetch(
      `${process.env.API_AGENT_URL!}/apps/appmuseme_agent/users/u_${trip?.userId?.toString()}/sessions/s_${updatedTrip?._id?.toString()}_${Date.now()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    // get the data
    const dataSession = await responseSession.json()

    // run the idea
    const response = await fetch(`${process.env.API_AGENT_URL!}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appName: 'appmuseme_agent',
        userId: dataSession.userId,
        sessionId: dataSession.id,
        newMessage: {
          role: 'user',
          parts: [
            {
              text: `Create a trip itinerary for ${trip.destination}.
              the duration of the trip is ${trip.duration} days.
              the season of the trip is ${trip.season}.
              the mood of the trip is ${trip.travelMood}.
              the trip is a ${trip.isWeekendTrip ? 'weekend' : 'week'} trip.
              the cultural preferences of the trip are ${trip.culturalPreferences.join(', ')}.
              the qloo tags of the trip are ${qlooTags.join(', ')}.
              the qloo entities of the trip are ${qlooEntities.join(', ')}.
              `,
            },
          ],
        },
      }),
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error(error)
  }
}
