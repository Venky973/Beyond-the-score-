import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    shortName: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 5
    },
    sport: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    logo: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    captain: {
      type: String,
      default: ''
    },
    coach: {
      type: String,
      default: ''
    },
    players: [
      {
        name: { type: String, required: true },
        role: { type: String, default: 'Player' },
        jerseyNumber: { type: Number, default: 0 },
        isCaptain: { type: Boolean, default: false }
      }
    ],
    stats: {
      matches: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      points: { type: Number, default: 0 }
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

teamSchema.index({ sport: 1, name: 1 });

export default mongoose.model('Team', teamSchema);
