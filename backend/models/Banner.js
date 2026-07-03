import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  buttonText: { type: String },
  link: { type: String },
  mediaUrl: { type: String, required: true }, // Image or Video URL
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  public_id: { type: String }, // For Cloudinary
  order: { type: Number, default: 0 },
  isEnabled: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
