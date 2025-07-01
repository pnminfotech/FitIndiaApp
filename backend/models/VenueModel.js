import mongoose from 'mongoose';

const VenueSchema = new mongoose.Schema({
  name: String,
  city: String,
  address: String,
  sports: [String],
  pricing: String,
  image: String,
});

export default mongoose.model('VenueModel', VenueSchema)
