import { Brain, Shield, Target, Zap } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Understanding',
    description:
      'Our LLM interprets your vague or expressive inputs like "I love ambient music, wine bars, and mid-century architecture" into actionable travel insights.',
  },
  {
    icon: Target,
    title: 'Cross-Domain Recommendations',
    description:
      'Using Qloo Taste AI, we connect your music taste to dining preferences, fashion sense to neighborhoods, creating holistic recommendations.',
  },
  {
    icon: Shield,
    title: 'Privacy-First Approach',
    description:
      'No personal data logging required. We build rich profiles using just taste signals, keeping your privacy intact.',
  },
  {
    icon: Zap,
    title: 'Real Culture, Not Trends',
    description:
      "Skip the tourist traps. Discover authentic local spots that align with your personal taste, not what's trending on social media.",
  },
]

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why AppmuseMe Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Most travel platforms push what's popular. We flip the model to show you what you'll actually enjoy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
