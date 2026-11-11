import mongoose from 'mongoose';

const adminActivitySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      required: true
    },
    targetType: {
      type: String,
      default: ''
    },
    targetId: {
      type: String,
      default: ''
    },
    details: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

adminActivitySchema.index({ createdAt: -1 });

export default mongoose.model('AdminActivity', adminActivitySchema);
