// controllers/authController.js

import User from "../models/User.js";
import { sendOtp as sendOtpUtil, verifyOtpCode } from "../utils/otpService.js";
import { generateToken } from "../utils/tokenService.js";

// ✅ Named export
export const sendOtp = async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ error: "Mobile number is required" });

  await sendOtpUtil(mobile);
  res.json({ message: "OTP sent successfully" });
};

// ✅ Named export
export const verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  const valid = verifyOtpCode(mobile, otp);
  if (!valid) return res.status(400).json({ error: "Invalid OTP" });

  let user = await User.findOne({ mobile });
  if (!user) user = await User.create({ mobile });

  user.isVerified = true;
  await user.save();

  const token = generateToken(user._id);
  res.json({ token, user });
};
