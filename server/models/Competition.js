import mongoose from 'mongoose';

const competitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    sport: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['international', 'national', 'domestic', 'state', 'local', 'amateur', 'friendly', 'practice'],
      default: 'local'
    },
    season: {
      type: String,
      default: '2026'
    },
    venue: {
      type: String,
      default: ''
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'ongoing'
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
      }
    ],
    description: {
      type: String,
      default: ''
    },
    banner: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

competitionSchema.index({ sport: 1, category: 1, status: 1 });

export default mongoose.model('Competition', competitionSchema);
