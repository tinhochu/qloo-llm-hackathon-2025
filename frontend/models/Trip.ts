import mongoose from 'mongoose'

import toJSON from './plugins/toJSON'

export const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: {
      type: String,
    },
    duration: {
      type: String,
    },
    isWeekendTrip: {
      type: Boolean,
      default: false,
    },
    season: {
      type: String,
    },
    travelMood: {
      type: String,
    },
    culturalPreferences: {
      type: [String],
    },
    qlooTags: {
      type: [String],
    },
    qlooEntities: {
      type: [String],
    },
    coords: {
      type: {
        lat: Number,
        lon: Number,
      },
    },
    itinerary: {
      type: Object,
    },
    itineraryText: {
      type: String,
    },
    weather: {
      type: Object,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

tripSchema.plugin(toJSON)

export default mongoose.models.Trip || mongoose.model('Trip', tripSchema)
