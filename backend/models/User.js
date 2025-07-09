import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  name: { type: String },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    }
  },
  sportsPreferences: [String],
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

userSchema.index({ location: "2dsphere" });

export default mongoose.model("User", userSchema);
