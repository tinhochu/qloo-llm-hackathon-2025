import { TravelItinerary } from "@/components/travel-itinerary"

export function DemoItinerary() {
  const demoTravelPlan = {
    destination: "Tokyo",
    tastes: "acid jazz, ramen, thrift shopping, sci-fi novels, quiet bookstores",
    duration: "3 days",
  }

  return <TravelItinerary travelPlan={demoTravelPlan} />
}
