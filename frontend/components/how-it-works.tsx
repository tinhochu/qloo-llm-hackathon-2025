import { MessageSquare, Brain, MapPin, Download } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    title: "Share Your Tastes",
    description:
      "Tell us about your destination and preferences: music, food, books, architecture, nightlife—anything that defines your taste.",
    example: '"I\'m going to Tokyo. I like acid jazz, ramen, thrift shopping, sci-fi novels, and quiet bookstores."',
  },
  {
    icon: Brain,
    title: "AI Processing",
    description:
      "Our LLM parses and categorizes your tastes, while Qloo API finds cross-domain connections and local insights.",
    example: "Acid jazz → nightlife venues, ramen → authentic local spots, thrift → vintage neighborhoods",
  },
  {
    icon: MapPin,
    title: "Personalized Itinerary",
    description:
      "Get a curated travel plan with breakfast spots, museums, shops, restaurants, and nightlife that match your unique taste profile.",
    example: "Jazz café in Shimokitazawa, vintage bookstores in Koenji, underground ramen joint, basement jazz bar",
  },
  {
    icon: Download,
    title: "Save & Share",
    description:
      "Download your itinerary as PDF, save to mobile, or share with travel companions. Plus get cultural primers and playlists.",
    example: "PDF itinerary, Spotify playlist, local author recommendations, exhibition guides",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From taste input to personalized itinerary in four simple steps
          </p>
        </div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <step.icon className="h-8 w-8 text-indigo-600" />
                  <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500">
                  <p className="text-sm text-gray-700 italic">Example: {step.example}</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <step.icon className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
