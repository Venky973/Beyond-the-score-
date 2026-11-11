import mongoose from 'mongoose';

const sportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    icon: {
      type: String,
      default: 'Trophy'
    },
    description: {
      type: String,
      default: ''
    },
    categories: {
      type: [String],
      default: ['International', 'National', 'Domestic', 'Local League', 'Friendly']
    },
    scoringStructure: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    isPopular: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Sport', sportSchema);
