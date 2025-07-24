import Header from '@/components/header'
import PlanningChat from '@/components/planning-chat'
import { Suspense } from 'react'

export default function PlanPage() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <div className="h-[calc(100vh-88px)] bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-4 pt-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl sm:text-3xl font-bold text-gray-900 mb-4">Plan Your Perfect Trip</h1>
              <div className="w-full max-w-md mx-auto">
                <p className="text-sm text-gray-700 font-mono">
                  Tell us about your destination and tastes. We'll create a personalized itinerary just for you.
                </p>
              </div>
            </div>

            <div className="w-full max-w-xl mx-auto">
              <PlanningChat />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
