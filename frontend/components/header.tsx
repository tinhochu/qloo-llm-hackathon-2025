'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { Plane, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const { user, isLoaded } = useUser()
  const pathname = usePathname()

  return (
    <header className="mx-auto px-4 py-6 flex items-center w-full justify-between">
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <Plane className="h-6 w-6 text-primary-foreground" />
              </div>
              CultureMatch
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {!isLoaded ? (
            <Skeleton className="w-32 h-[36px]" />
          ) : user ? (
            <>
              {pathname !== '/plan' && (
                <Link href="/plan">
                  <Button className="gap-2 hover:cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium">
                    Plan a Trip
                    <span className="relative flex size-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                    </span>
                  </Button>
                </Link>
              )}
              <UserButton />
            </>
          ) : (
            <SignInButton mode="modal">
              <Button className="gap-2 hover:cursor-pointer">
                <User size={16} />
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}
