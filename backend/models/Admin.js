
import mongoose from 'mongoose';
const AdminSchema = new mongoose.Schema({
  email: String,
  password: String, // Hashed
  role: { type: String, default: "admin" },
});
module.exports = mongoose.model("Admin", AdminSchema);
