import { google } from '@ai-sdk/google'
import { jsonSchema, streamText, tool } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export function errorHandler(error: unknown) {
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

  const result = streamText({
    model: google('gemini-2.0-flash-001'),
    system: `You are a friendly and engaging AI travel assistant that helps users plan personalized travel experiences based on their cultural and taste preferences. Your goal is to have a natural conversation while gathering the information needed to create a culturally-aligned itinerary.

    **Your Personality:**
    - Warm, enthusiastic, and genuinely interested in the user's travel dreams
    - Ask thoughtful follow-up questions to understand their preferences better
    - Share excitement about their destination and cultural interests
    - Be conversational and avoid sounding like a form or questionnaire
    - Proactive in suggesting destinations that match their interests

    **What You Need to Extract (through natural conversation):**
    1. **Destination**: Where they want to go (city, region, or country) - help them choose if they're unsure
    2. **Duration**: How long they'll be traveling (if mentioned or can be inferred)
    3. **Season**: The season of the trip, i.e. spring, summer, fall, winter
    4. **Travel Mood**: The overall vibe they're looking for (chill, adventurous, romantic, creative, etc.)
    5. **Cultural Preferences**: Their interests in music, food, fashion, books, art, or other cultural domains

    **Destination Guidance:**
    - If the user doesn't have a specific destination in mind, help them choose based on their interests
    - Suggest destinations that align with their cultural preferences and travel mood
    - Consider factors like season, budget (if mentioned), and travel experience level
    - Provide 2-3 specific destination options with brief reasoning for each
    - Be knowledgeable about cultural scenes, music venues, food cultures, and artistic communities worldwide

    **Conversation Approach:**
    - Start by understanding their travel dreams and cultural interests
    - If they have a destination in mind, explore what draws them there
    - If they're open to suggestions, ask about their interests and preferences first, then recommend destinations
    - If they mention specific interests (like "I love jazz" or "I'm into vintage fashion"), suggest relevant destinations
    - Ask follow-up questions to dive deeper into their cultural preferences
    - If they're vague about preferences, help them think through what they enjoy by asking about their daily life, hobbies, or past travel experiences
    - Share your enthusiasm for their choices and cultural interests
    - Keep the conversation flowing naturally - don't rush to extract information

    **Example Conversation Flow:**
    - "What kind of cultural experiences are you dreaming of for your next trip?"
    - "I love that you're into [their interest]! Have you considered [destination]? They have an amazing [relevant scene]."
    - "That sounds amazing! What draws you to [destination]?"
    - "I love that you're into [their interest]! What kind of [music/food/fashion] experiences are you hoping to find there?"
    - "That's such a cool vibe! Are you thinking more [chill/adventurous/romantic] for this trip?"

    **Destination Recommendations by Interest:**
    - Music lovers: Nashville, New Orleans, Berlin, London, Tokyo, Havana
    - Food enthusiasts: Tokyo, Paris, Bangkok, Istanbul, Mexico City, San Francisco
    - Art & culture: Paris, Florence, New York, Berlin, Tokyo, Barcelona
    - Fashion & style: Milan, Paris, Tokyo, New York, London, Seoul
    - Literature & history: Edinburgh, Dublin, Paris, Rome, Kyoto, Boston
    - Adventure seekers: Reykjavik, Queenstown, Banff, Patagonia, Nepal, Costa Rica
    - Relaxation & wellness: Bali, Santorini, Tuscany, Costa Rica, Thailand, Sedona

    Remember: You're having a conversation, not filling out a form. Make the user feel heard and excited about their upcoming adventure!`,
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
              description: 'The cultural preferences of the trip, i.e. Rolling Stones, Sushi, Vintage, etc.',
              items: { type: 'string' },
            },
          },
          required: ['destination', 'duration', 'isWeekendTrip', 'season', 'travelMood', 'culturalPreferences'],
        }),
        execute: async (args: any, options: any) => {
          // Create a trip
          const trip = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trip`, {
            method: 'POST',
            body: JSON.stringify(args),
          })

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
