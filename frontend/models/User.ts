import mongoose from 'mongoose'

import toJSON from './plugins/toJSON'

// USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Email is required'],
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    clerkId: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Clerk ID is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

// add plugin that converts mongoose to json
userSchema.plugin(toJSON)

export default mongoose.models.User || mongoose.model('User', userSchema)
