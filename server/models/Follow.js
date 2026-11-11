import mongoose from 'mongoose';

const followSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    targetType: {
      type: String,
      enum: ['player', 'team', 'match'],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
);

followSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

export default mongoose.model('Follow', followSchema);
