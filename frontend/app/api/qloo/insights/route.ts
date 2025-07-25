import { google } from '@ai-sdk/google'
import { generateText, jsonSchema, streamText, tool } from 'ai'

import { prompt } from './.prompt'

// Allow streaming responses up to 5 minutes
export const maxDuration = 300

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

  const { text } = await generateText({
    model: google('gemini-2.0-flash-001'),
    system: prompt,
    messages,
    tools: {
      getInsights: tool({
        description: 'Get insights for multiple cultural preferences',
        parameters: jsonSchema({
          type: 'object',
          properties: {
            culturalPreferences: {
              type: 'string',
              description: 'Comma-separated string of cultural preferences to get insights for',
            },
            interestsEntities: {
              type: 'string',
              description: 'The Qloo entities from the user message (comma-separated string)',
            },
            tags: { type: 'string', description: 'The Qloo tags from the user message (comma-separated string)' },
          },
          required: ['culturalPreferences', 'interestsEntities', 'tags'],
        }),
        execute: async (args: any, options: any) => {
          const { culturalPreferences, interestsEntities, tags } = args

          // Get API key from environment variable
          const apiKey = process.env.QLOO_API_KEY
          if (!apiKey) {
            return {
              success: false,
              error: 'QLOO_API_KEY environment variable not set',
              status_code: null,
            }
          }

          // Build the API URL
          const baseUrl = process.env.QLOO_API_URL || 'https://api.qloo.com'
          const url = `${baseUrl}/v2/insights/`

          const headers = {
            'x-api-key': apiKey,
          }

          // Split cultural preferences and process each one
          const preferences = culturalPreferences
            .split(',')
            .map((pref: string) => pref.trim())
            .filter((pref: string) => pref.length > 0)

          const results = []

          try {
            for (const preference of preferences) {
              // Build query parameters for each preference
              const params = new URLSearchParams({
                'filter.type': 'urn:entity:place',
                'signal.location.query': preference,
                'signal.interests.entities': interestsEntities,
                'filter.tags': tags,
              })

              const response = await fetch(`${url}?${params.toString()}`, {
                method: 'GET',
                headers,
              })

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for preference: ${preference}`)
              }

              const data = await response.json()

              results.push({
                preference,
                data,
                status_code: response.status,
              })
            }

            return {
              success: true,
              data: results,
              status_code: 200,
            }
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error occurred',
              status_code: null,
            }
          }
        },
      }),
    },
  })

  return Response.json({ text })
}
