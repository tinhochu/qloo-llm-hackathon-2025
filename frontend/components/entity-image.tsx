import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

function EntityImageLoading() {
  return <Skeleton className="w-full h-full" />
}

function EntityImageError() {
  return <Skeleton className="w-full h-full" />
}

async function EntityImage({ entityId }: { entityId: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qloo/entities?entity_ids=${entityId}`)

  if (!response.ok) {
    return <EntityImageError />
  }

  const data = await response.json()

  // Check if the image returns a 500 code when its being called
  const imageResponse = await fetch(data.results[0].properties.image.url)
  if (imageResponse.status === 500) {
    return <EntityImageError />
  }

  return (
    <div className="w-full h-full relative overflow-hidden rounded-lg">
      <Image src={data.results[0].properties.image.url} alt={data.results[0].name} fill className="object-cover" />
    </div>
  )
}

export { EntityImage, EntityImageLoading }
