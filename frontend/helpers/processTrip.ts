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

export default async function processTrip(tripId: string) {
  try {
    await connectMongo()

    const tripObject = await Trip.findById(tripId)

    if (!tripObject) {
      throw new Error('Trip not found')
    }

    const tripData = tripObject.toJSON()

    // get the coordinates from the location
    const coords = await getCoordsfromLocation(tripData?.destination || '')

    // get the qloo tags
    const qlooTags = await getQlooTags(tripData)

    // get the qloo entities
    const qlooEntities = await getQlooEntities(tripData, coords)

    // update the trip with the qloo tags
    const updatedTrip = await Trip.findByIdAndUpdate(tripId, {
      $set: { qlooTags, qlooEntities, coords: { lat: coords.lat, lon: coords.lon } },
    })

    // run the idea
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/qloo/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Create a trip itinerary for ${tripData?.destination}.
              the duration of the trip is ${tripData?.duration} days, give me the itinerary for all the days of the trip.
              the season of the trip is ${updatedTrip?.season}.
              the mood of the trip is ${updatedTrip?.travelMood}.
              the cultural preferences of the trip are ${updatedTrip?.culturalPreferences.join(', ')}.
              the qloo tags of the trip are ${qlooTags.join(', ')}.
              the qloo entities of the trip are ${qlooEntities.join(', ')}.
              the itinerary should be in JSON format.
              `,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get insights')
    }

    const data = await response.json()

    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}
