'use client'

import { Check } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

const steps = [
  {
    id: 0,
    label: 'Initializing',
    description: 'Setting up your trip',
  },
  {
    id: 1,
    label: 'Pending',
    description: 'Waiting for processing',
  },
  {
    id: 2,
    label: 'Generating',
    description: 'Creating itinerary',
  },
]

export default function TripDetailsLoading({ trip }: { trip: any }) {
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(
    function initPusher() {
      // Initialize Pusher
      const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY
      const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER

      if (!pusherKey || !pusherCluster) {
        console.error('Pusher key or cluster is not defined')
        return
      }

      const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
      })

      const channel = pusher.subscribe(`trip-${trip.id}`)

      channel.bind('trip.status.updated', (data: any) => {
        // Update progress based on real status

        if (data.status === 'processing') {
          setCurrentStep(2)
        } else if (data.status === 'completed') {
          setCurrentStep(3)
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        }
      })

      // Cleanup on unmount
      return () => {
        channel.unbind_all()
        pusher.unsubscribe(`trip-${trip.id}`)
      }
    },
    [trip.id]
  )

  return (
    <div className="h-[calc(100vh-88px)] bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-4xl mx-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col  flex-1">
                    <div className="flex items-center w-full">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                          ${
                            index <= currentStep
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          }
                        `}
                      >
                        {index < currentStep ? (
                          <Check className="w-5 h-5" />
                        ) : index === currentStep ? (
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`
                            flex-1 h-0.5 mx-4 transition-all duration-500
                            ${index < currentStep ? 'bg-indigo-600' : 'bg-gray-300'}
                          `}
                        />
                      )}
                    </div>
                    <div className="text-left mt-2">
                      <div
                        className={`
                          text-sm font-medium transition-colors duration-300
                          ${index <= currentStep ? 'text-indigo-600' : 'text-gray-400'}
                        `}
                      >
                        {step.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mx-auto mb-6" />

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Creating Your Perfect {trip.destination} Itinerary
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              {`We're analyzing your cultural preferences and crafting a personalized travel experience just for you.`}
            </p>

            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-3">Trip Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Destination:</strong> {trip.destination}
                </p>
                <p>
                  <strong>Duration:</strong> {trip.duration}
                </p>
                <p>
                  <strong>Mood:</strong> {trip.travelMood}
                </p>
                <p>
                  <strong>Season:</strong> {trip.season}
                </p>
                <p>
                  <strong>Interests:</strong> {trip.culturalPreferences.join(', ')}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              This usually takes a few minutes. You can refresh the page to check the status.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
