import mongoose from 'mongoose';
const BookingSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  facilityId: mongoose.Schema.Types.ObjectId,
  slotTime: String,
  status: { type: String, enum: ["paid", "pending"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Booking", BookingSchema);
