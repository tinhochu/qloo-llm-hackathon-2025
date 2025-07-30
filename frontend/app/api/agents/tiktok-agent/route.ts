import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

import { prompt } from './.prompt'

// Allow streaming responses up to 5 minutes
export const maxDuration = 300

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Use streamText to avoid token limits and collect the full response
    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      system: prompt,
      messages,
    })

    return Response.json({ text })
  } catch (error) {
    console.error(error)
    return new Response('Internal Server Error', {
      status: 500,
    })
  }
}
