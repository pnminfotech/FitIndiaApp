import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  // ---------------- Admin login fields ----------------
  email: { 
    type: String, 
    required: function() { return this.role === "admin"; }, // only required for admins
  },
  password: { type: String }, // only for admin

  // ---------------- Common fields ----------------
  name: { type: String, default: "" },
  role: { type: String, enum: ['user', 'coach', 'admin'], default: 'user' },
  blocked: { type: Boolean, default: false },

  // ---------------- User OTP login fields ----------------
  mobile: { type: String, unique: true, sparse: true }, // only for user
  otp: { type: String },
  otpExpires: { type: Date },

  // ---------------- Optional user info ----------------
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  dateOfBirth: { type: Date, default: null },
  city: { type: String, default: "" },
  sportsPreferences: [String],
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

// ---------------- Password Hashing for Admin ----------------
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---------------- Compare password (Admin only) ----------------
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// ---------------- Partial unique index for email ----------------
// ✅ Only enforce uniqueness if email is a string (admins)
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string" } } }
);

export default mongoose.model('User', userSchema);
