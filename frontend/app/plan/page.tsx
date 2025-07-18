import PlanningChat from '@/components/planning-chat'

export default function PlanPage() {
  return (
    <div className="h-[calc(100vh-88px)] bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-3xl font-bold text-gray-900 mb-4">Plan Your Perfect Trip</h1>
            <div className="w-full max-w-md mx-auto">
              <p className="text-sm text-gray-700 font-mono">
                Tell us about your destination and tastes. We'll create a personalized itinerary just for you.
              </p>
            </div>
          </div>

          <PlanningChat />
        </div>
      </div>
    </div>
  )
}
