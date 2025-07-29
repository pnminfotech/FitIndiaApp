import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  name: String,
  city: String,
  mobile: { type: String, unique: true, sparse: true },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male',
  },
  dateOfBirth: Date,

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  blocked: {
  type: Boolean,
  default: false,
},

  sportsPreferences: [String],
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['user', 'coach', 'admin'],
    default: 'user',
  }
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

/* ✅ Password Hashing Middleware */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* ✅ Method for Comparing Passwords */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
