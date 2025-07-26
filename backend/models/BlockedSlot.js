import mongoose from 'mongoose';

const BlockedSlotSchema = new mongoose.Schema({
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'VenueModel' },
  courtId: { type: mongoose.Schema.Types.ObjectId },
  date: { type: Date },
  startDate: { type: Date }, // only for monthly block
  endDate: { type: Date },   // only for monthly block
  startTime: { type: String }, // ✅ Add this
  endTime: { type: String },   // ✅ Add this
});

export default mongoose.model('BlockedSlotModel', BlockedSlotSchema);
