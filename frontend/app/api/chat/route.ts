import { google } from '@ai-sdk/google'
import { auth } from '@clerk/nextjs/server'
import { jsonSchema, streamText, tool } from 'ai'

import { prompt } from './.prompt'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

function errorHandler(error: unknown) {
  if (error == null) {
    return 'unknown error'
  }

  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message
  }

  return JSON.stringify(error)
}

export async function POST(req: Request) {
  const { messages } = await req.json()
  const { userId } = await auth()

  const result = streamText({
    model: google('gemini-2.0-flash-001'),
    system: prompt,
    messages,
    tools: {
      askForConfirmation: {
        description: 'Ask the user for confirmation.',
        parameters: jsonSchema({
          type: 'object',
          properties: {
            message: { type: 'string', description: 'The message to ask for confirmation.' },
          },
          required: ['message'],
        }),
      },
      createTrip: tool({
        description: "Create a trip based on the user's preferences",
        parameters: jsonSchema({
          type: 'object',
          properties: {
            destination: { type: 'string', description: 'The city and country of the trip, i.e. Tokyo, Japan' },
            duration: { type: 'string', description: 'The duration of the trip in days, i.e. 3' },
            isWeekendTrip: { type: 'boolean', description: 'Whether the trip is a weekend trip, i.e. true' },
            season: { type: 'string', description: 'The season of the trip, i.e. spring, summer, fall, winter' },
            travelMood: {
              type: 'string',
              description: 'The travel mood of the trip i.e. chill, adventurous, romantic, creative, etc. i.e. chill',
            },
            culturalPreferences: {
              type: 'array',
              description:
                'The cultural preferences of the trip, i.e. Rolling Stones, Sushi, Vintage, etc. (optional - can be empty)',
              items: { type: 'string' },
            },
          },
          required: ['destination', 'duration', 'isWeekendTrip', 'season', 'travelMood'],
        }),
        execute: async (args: any, options: any) => {
          // Create a trip
          const trip = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trip`, {
            method: 'POST',
            body: JSON.stringify({ ...args, userId }),
          })

          // if the trip is not created, throw an error
          if (!trip.ok) {
            throw new Error('Failed to create trip')
          }

          const data = await trip.json()

          return data
        },
      }),
    },
  })

  return result.toDataStreamResponse({
    getErrorMessage: errorHandler,
  })
}
