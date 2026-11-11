import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true
    },
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Turf',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sport: {
      type: String,
      required: true
    },
    bookingDate: {
      type: String, // 'YYYY-MM-DD'
      required: true
    },
    startTime: {
      type: String, // 'HH:mm' e.g. '18:00'
      required: true
    },
    endTime: {
      type: String, // 'HH:mm' e.g. '20:00'
      required: true
    },
    durationHours: {
      type: Number,
      required: true,
      min: 1
    },
    rentalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
      default: 'pending'
    },
    notes: {
      type: String,
      default: ''
    },
    operatorNotes: {
      type: String,
      default: ''
    },
    cancellationReason: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ turf: 1, bookingDate: 1, status: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);
