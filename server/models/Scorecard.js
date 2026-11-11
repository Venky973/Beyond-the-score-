import mongoose from 'mongoose';

const scorecardSchema = new mongoose.Schema(
  {
    title: {
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
    matchType: {
      type: String,
      enum: ['friendly', 'practice', 'local_tournament', 'amateur', 'personal'],
      default: 'friendly'
    },
    venue: {
      type: String,
      default: 'Community Ground'
    },
    matchDate: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: String,
      default: '2 Hours'
    },
    visibility: {
      type: String,
      enum: ['public', 'unlisted', 'private'],
      default: 'public'
    },
    shareCode: {
      type: String,
      unique: true,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    teamA: {
      name: { type: String, required: true },
      scoreDisplay: { type: String, default: '0' },
      scoreDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
      players: [
        {
          name: { type: String, required: true },
          role: { type: String, default: 'Player' },
          stats: { type: mongoose.Schema.Types.Mixed, default: {} }
        }
      ]
    },
    teamB: {
      name: { type: String, required: true },
      scoreDisplay: { type: String, default: '0' },
      scoreDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
      players: [
        {
          name: { type: String, required: true },
          role: { type: String, default: 'Player' },
          stats: { type: mongoose.Schema.Types.Mixed, default: {} }
        }
      ]
    },
    sportData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    result: {
      winner: { type: String, default: '' },
      margin: { type: String, default: '' },
      summary: { type: String, default: '' }
    },
    notes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'completed'
    }
  },
  {
    timestamps: true
  }
);

scorecardSchema.index({ creator: 1, createdAt: -1 });
scorecardSchema.index({ visibility: 1, sport: 1 });

export default mongoose.model('Scorecard', scorecardSchema);
