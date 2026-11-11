import mongoose from 'mongoose';

const turfAvailabilitySchema = new mongoose.Schema(
  {
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Turf',
      required: true
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true
    },
    blockedSlots: [
      {
        startTime: { type: String, required: true }, // '14:00'
        endTime: { type: String, required: true },   // '16:00'
        reason: { type: String, default: 'Maintenance / Internal Event' }
      }
    ],
    isFullyBlocked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

turfAvailabilitySchema.index({ turf: 1, date: 1 }, { unique: true });

export default mongoose.model('TurfAvailability', turfAvailabilitySchema);
