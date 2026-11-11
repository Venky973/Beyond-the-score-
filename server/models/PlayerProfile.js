import mongoose from 'mongoose';

const playerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String,
      default: ''
    },
    sport: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    teamName: {
      type: String,
      default: 'Independent'
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    position: {
      type: String,
      default: 'All-Rounder'
    },
    jerseyNumber: {
      type: Number,
      default: 10
    },
    location: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    matchesPlayed: {
      type: Number,
      default: 0
    },
    wins: {
      type: Number,
      default: 0
    },
    losses: {
      type: Number,
      default: 0
    },
    draws: {
      type: Number,
      default: 0
    },
    // Sport specific breakdown
    cricketStats: {
      runs: { type: Number, default: 0 },
      battingAvg: { type: Number, default: 0 },
      strikeRate: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      bowlingEconomy: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
      fifties: { type: Number, default: 0 },
      hundreds: { type: Number, default: 0 },
      catches: { type: Number, default: 0 }
    },
    footballStats: {
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      cleanSheets: { type: Number, default: 0 },
      yellowCards: { type: Number, default: 0 },
      redCards: { type: Number, default: 0 },
      shotsOnTarget: { type: Number, default: 0 },
      passAccuracy: { type: Number, default: 0 }
    },
    basketballStats: {
      points: { type: Number, default: 0 },
      rebounds: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      steals: { type: Number, default: 0 },
      blocks: { type: Number, default: 0 },
      fgPercentage: { type: Number, default: 0 }
    },
    tennisStats: {
      aces: { type: Number, default: 0 },
      setsWon: { type: Number, default: 0 },
      breakPointsWon: { type: Number, default: 0 },
      firstServePct: { type: Number, default: 0 },
      titles: { type: Number, default: 0 }
    },
    volleyballStats: {
      spikes: { type: Number, default: 0 },
      blocks: { type: Number, default: 0 },
      serviceAces: { type: Number, default: 0 },
      digs: { type: Number, default: 0 }
    },
    badmintonStats: {
      smashes: { type: Number, default: 0 },
      netPoints: { type: Number, default: 0 },
      tournamentWins: { type: Number, default: 0 }
    },
    recentForm: {
      type: [String],
      default: ['W', 'W', 'W', 'L', 'W']
    }
  },
  {
    timestamps: true
  }
);

playerProfileSchema.index({ sport: 1, name: 1 });

export default mongoose.model('PlayerProfile', playerProfileSchema);
