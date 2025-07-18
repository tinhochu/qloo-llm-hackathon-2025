import connectMongo from '@/lib/mongoose'
import User from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'

const CLERK_EVENTS = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo()

    const { data, type } = await req.json()

    switch (type) {
      case CLERK_EVENTS.USER_CREATED:
        // Check if the Clerk ID already exists in our database
        const existingUser = await User.findOne({ clerkId: data.id })

        if (existingUser) {
          return NextResponse.json({ message: 'User already exists' }, { status: 200 })
        }

        // Create a new user in our database
        const newUser = new User({
          email: data.email_addresses[0].email_address,
          firstName: data?.first_name ?? '',
          lastName: data?.last_name ?? '',
          clerkId: data.id,
        })

        // Save the new user to the database
        await newUser.save()

        // Send a welcome email to the user
        return NextResponse.json({ message: 'User created' }, { status: 201 })

      case CLERK_EVENTS.USER_DELETED:
        // delete also the shops of the user
        const user = await User.findOne({ clerkId: data.id })

        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

        await user.deleteOne()

        return NextResponse.json({ message: 'User deleted' }, { status: 200 })

      default:
        return NextResponse.json({ message: 'OK' }, { status: 200 })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}
