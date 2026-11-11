import mongoose from 'mongoose';

const matchEventSchema = new mongoose.Schema(
  {
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true
    },
    time: {
      type: String,
      default: '' // e.g. "45+2'", "Over 18.2", "Q3 04:12", "Set 2"
    },
    eventType: {
      type: String,
      required: true
      // 'goal', 'card', 'sub', 'wicket', 'boundary_four', 'boundary_six', 'point', 'three_pointer', 'dunk', 'ace', 'foul'
    },
    team: {
      type: String,
      enum: ['teamA', 'teamB', 'neutral'],
      default: 'teamA'
    },
    player: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    scoreSnapshot: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

matchEventSchema.index({ match: 1, createdAt: -1 });

export default mongoose.model('MatchEvent', matchEventSchema);
