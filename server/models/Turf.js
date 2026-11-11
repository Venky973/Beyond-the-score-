import mongoose from 'mongoose';

const turfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide turf facility name'],
      trim: true
    },
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      default: ''
    },
    zipCode: {
      type: String,
      default: ''
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: '2dsphere'
      }
    },
    supportedSports: {
      type: [String],
      required: true,
      default: ['Football', 'Cricket']
    },
    rentalPricePerHour: {
      type: Number,
      required: true,
      min: [0, 'Price must be positive']
    },
    operatingHours: {
      open: { type: String, default: '06:00' },
      close: { type: String, default: '23:00' },
      daysOpen: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      }
    },
    facilities: {
      type: [String],
      default: [
        'Floodlights',
        'Changing Rooms',
        'Covered Seating',
        'Mineral Water',
        'Free Parking',
        'Locker Facility'
      ]
    },
    images: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      default: ''
    },
    contactPhone: {
      type: String,
      default: ''
    },
    contactEmail: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 4.8
    },
    totalReviews: {
      type: Number,
      default: 24
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

turfSchema.index({ city: 1, status: 1 });
turfSchema.index({ supportedSports: 1 });
turfSchema.index({ rentalPricePerHour: 1 });

export default mongoose.model('Turf', turfSchema);
