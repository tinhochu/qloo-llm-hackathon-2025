import { NextRequest, NextResponse } from 'next/server'

/**
 * @description Get entities by ids
 * @param request - The request object
 * @returns The response object
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entity_ids = searchParams.get('entity_ids')

    if (!entity_ids) {
      return NextResponse.json({ error: 'Missing entity_ids' }, { status: 400 })
    }

    // fetch Entities from Qloo
    const response = await fetch(`${process.env.QLOO_API_URL}/entities?entity_ids=${entity_ids}`, {
      headers: {
        'x-api-key': process.env.QLOO_API_KEY || '',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch entities' }, { status: 500 })
    }

    const data = await response.json()

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
