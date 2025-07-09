import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
  date: Date,
  startTime: String,
  endTime: String,
  isAvailable: { type: Boolean, default: true },
  day: String,
}, { _id: true });

const CourtSchema = new mongoose.Schema({
  courtName: String,
  sports: [String],
  slots: [SlotSchema],
});
const VenueSchema = new mongoose.Schema({
  name: String,
  city: String,
  location: {
    address: { type: String},
    lat: { type: Number },
    lng: { type: Number }
  },
  pricing: String,
  image: String,
  sports: [String],      // Array of strings
  amenities: [String],
  courts: [CourtSchema],
});

export default mongoose.model('VenueModel', VenueSchema)
