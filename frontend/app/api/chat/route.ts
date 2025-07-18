import { google } from "@ai-sdk/google";
import { streamText, tool, jsonSchema } from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export function errorHandler(error: unknown) {
  if (error == null) {
    return "unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error);
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system: `You are a friendly and engaging AI travel assistant that helps users plan personalized travel experiences based on their cultural and taste preferences. Your goal is to have a natural conversation while gathering the information needed to create a culturally-aligned itinerary.

    **Your Personality:**
    - Warm, enthusiastic, and genuinely interested in the user's travel dreams
    - Ask thoughtful follow-up questions to understand their preferences better
    - Share excitement about their destination and cultural interests
    - Be conversational and avoid sounding like a form or questionnaire

    **What You Need to Extract (through natural conversation):**
    1. **Destination**: Where they want to go (city, region, or country)
    2. **Duration**: How long they'll be traveling (if mentioned or can be inferred)
    3. **Cultural Preferences**: Their interests in music, food, fashion, books, art, or other cultural domains
    4. **Travel Mood**: The overall vibe they're looking for (chill, adventurous, romantic, creative, etc.)

    **Conversation Approach:**
    - Start by asking about their travel destination and what excites them about it
    - If they mention specific interests (like "I love jazz" or "I'm into vintage fashion"), ask follow-up questions to dive deeper
    - If they're vague about preferences, help them think through what they enjoy by asking about their daily life, hobbies, or past travel experiences
    - Share your enthusiasm for their choices and cultural interests
    - Keep the conversation flowing naturally - don't rush to extract information

    **Example Conversation Flow:**
    - "That sounds amazing! What draws you to [destination]?"
    - "I love that you're into [their interest]! What kind of [music/food/fashion] experiences are you hoping to find there?"
    - "That's such a cool vibe! Are you thinking more [chill/adventurous/romantic] for this trip?"

    Remember: You're having a conversation, not filling out a form. Make the user feel heard and excited about their upcoming adventure!`,
    messages,
    tools: {
      askForConfirmation: {
        description: "Ask the user for confirmation.",
        parameters: jsonSchema({
          type: "object",
          properties: {
            message: { type: "string", description: "The message to ask for confirmation." },
          },
          required: ["message"],
        }),
      },
      createTrip: tool({
        description: "Create a trip based on the user's preferences",
        parameters: jsonSchema({
          type: "object",
          properties: {
            destination: { type: "string", description: "The destination of the trip" },
            duration: { type: "string", description: "The duration of the trip in days" },
            isWeekendTrip: { type: "boolean", description: "Whether the trip is a weekend trip" },
            travelMood: { type: "string", description: "The travel mood of the trip" },
          },
          required: ["destination", "duration", "isWeekendTrip", "travelMood"],
        }),
        execute: async (args: unknown) => {
          const { destination, duration, isWeekendTrip, travelMood } = args as {
            destination: string;
            duration: string;
            isWeekendTrip: boolean;
            culturalPreferences: string[];
            travelMood: string;
          };
          const trip = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trip`, {
            method: "POST",
            body: JSON.stringify({ destination, duration, isWeekendTrip, travelMood }),
          });

          if (!trip.ok) {
            throw new Error("Failed to create trip");
          }

          const data = await trip.json();

          return data;
        },
        maxRetries: 3,
      }),
    },
  });

  return result.toDataStreamResponse({
    getErrorMessage: errorHandler,
  });
}
