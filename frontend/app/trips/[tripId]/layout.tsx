import Header from '@/components/header'
import TripList from '@/components/trip-list'
import { Suspense } from 'react'

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tripId: string }>
}) {
  const { tripId } = await params

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <div className="h-[calc(100vh-88px)]">
        <div className="w-full max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <TripList tripId={tripId} />
            </div>
            <div className="col-span-1 lg:col-span-3">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}
