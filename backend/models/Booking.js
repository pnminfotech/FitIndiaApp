// import mongoose from 'mongoose';
// const BookingSchema = new mongoose.Schema({
//   userId: mongoose.Schema.Types.ObjectId,
//   facilityId: mongoose.Schema.Types.ObjectId,
//   slotTime: String,
//   status: { type: String, enum: ["paid", "pending"], default: "pending" },
//   createdAt: { type: Date, default: Date.now },
// });
// export default mongoose.model('BookingModel', BookingSchema)



// 1. 📁 models/BookingModel.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'VenueModel', required: true },
  courtId: { type: String, required: true },
  courtName: { type: String },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: {
    type: String,
    enum: ['booked', 'cancelled'],
    default: 'booked'
  }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
