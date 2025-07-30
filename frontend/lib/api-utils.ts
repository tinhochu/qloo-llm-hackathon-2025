// Utility functions for optimized API calls

export async function batchApiCalls<T>(
  items: any[],
  apiCall: (item: any) => Promise<T>,
  batchSize: number = 5
): Promise<(T | null)[]> {
  const results: (T | null)[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchPromises = batch.map(async (item) => {
      try {
        return await apiCall(item)
      } catch (error) {
        console.error('API call failed:', error)
        return null
      }
    })

    const batchResults = await Promise.allSettled(batchPromises)
    results.push(...batchResults.map((result) => (result.status === 'fulfilled' ? result.value : null)))
  }

  return results
}

export async function getTikTokData(item: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agents/tiktok-agent`, {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Check if this place named: ${item.recommendation.name} in ${item.recommendation.location} is trendy or not, the Entity ID is: ${item.recommendation.entity_id}`,
          },
        ],
      }),
    })

    if (!response.ok) return null

    const data = await response.json()
    return JSON.parse(data.text.replace(/```json\n|```/g, ''))
  } catch (error) {
    console.error('TikTok agent error:', error)
    return null
  }
}

export async function getInstagramData(item: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agents/instagram-agent`, {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Check if this place named: ${item.recommendation.name} in ${item.recommendation.location} is trendy or not, the Entity ID is: ${item.recommendation.entity_id}`,
          },
        ],
      }),
    })

    if (!response.ok) return null

    const data = await response.json()
    return JSON.parse(data.text.replace(/```json\n|```/g, ''))
  } catch (error) {
    console.error('Instagram agent error:', error)
    return null
  }
}

export async function getEntityImageData(entityId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qloo/entities?entity_ids=${entityId}`)

    if (!response.ok) return null

    const data = await response.json()

    // Check if the image returns a 500 code when its being called
    const imageResponse = await fetch(data.results[0].properties.image.url)
    if (imageResponse.status === 500) return null

    return data.results[0]
  } catch (error) {
    console.error('Entity image error:', error)
    return null
  }
}
