import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
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
    competition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition'
    },
    competitionName: {
      type: String,
      default: 'Exhibition Series'
    },
    category: {
      type: String,
      enum: ['international', 'national', 'domestic', 'state', 'local', 'amateur', 'friendly', 'practice'],
      default: 'local'
    },
    teamA: {
      name: { type: String, required: true },
      shortName: { type: String, default: '' },
      logo: { type: String, default: '' },
      teamRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
      score: { type: mongoose.Schema.Types.Mixed, default: 0 }, // e.g. { runs: 174, wickets: 4, overs: 18.2 } or 2
      scoreDisplay: { type: String, default: '0' } // e.g. "174/4 (18.2)" or "2" or "98"
    },
    teamB: {
      name: { type: String, required: true },
      shortName: { type: String, default: '' },
      logo: { type: String, default: '' },
      teamRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
      score: { type: mongoose.Schema.Types.Mixed, default: 0 },
      scoreDisplay: { type: String, default: '0' }
    },
    venue: {
      type: String,
      required: true,
      trim: true
    },
    scheduledAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    matchProgress: {
      type: String,
      default: 'Not Started'
      // e.g. "Over 18.4", "76'", "Halftime", "Q4 02:45", "Set 2 (4-2)", "Completed"
    },
    sportDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
      /*
        Sport-specific payload:
        Cricket: {
          toss: "Team A won the toss and elected to bat",
          currentInnings: 1,
          crr: 9.32,
          rrr: null,
          target: null,
          batsmen: [ { name: "Virat R.", runs: 64, balls: 41, fours: 6, sixes: 2, onStrike: true } ],
          bowlers: [ { name: "Jasprit B.", overs: 3.4, maidens: 0, runs: 28, wickets: 2 } ],
          recentBalls: ["1", "4", "0", "W", "2", "6"]
        }
        Football: {
          time: "74'",
          possession: [56, 44],
          shots: [14, 8],
          shotsOnTarget: [6, 3],
          corners: [7, 2],
          fouls: [9, 11],
          goals: [
            { minute: "24'", team: "teamA", player: "Julian Santos", assist: "Marco V." },
            { minute: "68'", team: "teamB", player: "Alexander Cole" }
          ],
          cards: [
            { minute: "38'", team: "teamA", player: "Ramiro", card: "yellow" }
          ]
        }
        Basketball: {
          quarter: "Q3",
          quarterScores: { teamA: [24, 28, 22], teamB: [20, 31, 26] },
          topScorerA: { name: "Marcus Hayes", points: 26 },
          topScorerB: { name: "DeAndre Clark", points: 24 }
        }
        Tennis: {
          sets: [ { teamA: 6, teamB: 4 }, { teamA: 3, teamB: 6 }, { teamA: 4, teamB: 3 } ],
          currentGame: { teamA: '30', teamB: '40' },
          server: 'teamA'
        }
      */
    },
    result: {
      winner: { type: String, default: '' }, // 'teamA', 'teamB', 'draw', 'tied', 'no-result'
      margin: { type: String, default: '' }, // e.g. "Apex Rangers won by 24 runs"
      summary: { type: String, default: '' }
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

matchSchema.index({ sport: 1, status: 1, scheduledAt: -1 });

export default mongoose.model('Match', matchSchema);
