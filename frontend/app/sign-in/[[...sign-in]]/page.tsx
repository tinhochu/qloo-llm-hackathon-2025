import { SignIn } from '@clerk/nextjs'
import { Globe, Plane, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute top-20 right-10 opacity-10">
        <Globe className="h-32 w-32 text-white" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10">
        <Plane className="h-24 w-24 text-white" />
      </div>
      <div className="absolute top-1/2 right-20 opacity-5">
        <Sparkles className="h-40 w-40 text-white" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors">
            <Plane className="h-6 w-6" />
            <span className="text-xl font-bold">CultureMatch</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-md">
          {/* Brand Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join CultureMatch</h1>
            <p className="text-indigo-100 text-lg">Start discovering cities that match your unique taste</p>
          </div>

          {/* Clerk Sign Up Component with Custom Styling */}
          <div className="">
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'w-full mx-auto',
                  card: 'bg-transparent shadow-none border-none',
                  headerTitle: 'text-gray-900 text-xl font-semibold',
                  headerSubtitle: 'text-gray-600',
                  socialButtonsBlockButton:
                    'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium',
                  socialButtonsBlockButtonText: 'font-medium',
                  formButtonPrimary:
                    'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium',
                  formFieldInput: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                  footerActionLink: 'text-indigo-600 hover:text-indigo-800',
                  identityPreviewText: 'text-gray-700',
                  identityPreviewEditButton: 'text-indigo-600 hover:text-indigo-800',
                },
              }}
            />
          </div>

          {/* What You Get */}
          <div className="mt-8">
            <h3 className="text-white font-semibold mb-4 text-center">What you'll get:</h3>
            <div className="space-y-3 text-white/90">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-sm">Personalized travel itineraries based on your taste</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span className="text-sm">Hidden gems and local culture, not tourist traps</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm">Cross-domain recommendations (music → dining → neighborhoods)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Save and share your favorite itineraries</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
