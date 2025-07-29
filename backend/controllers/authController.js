// // controllers/authController.js

// import User from "../models/User.js";
// import { sendOtp as sendOtpUtil, verifyOtpCode } from "../utils/otpService.js";
// import { generateToken } from "../utils/tokenService.js";

// // ✅ Named export
// export const sendOtp = async (req, res) => {
//   const { mobile } = req.body;
//   if (!mobile) return res.status(400).json({ error: "Mobile number is required" });

//   await sendOtpUtil(mobile);
//   res.json({ message: "OTP sent successfully" });
// };

// // controllers/authController.js

// export const verifyOtp = async (req, res) => {
//   const { mobile, otp, role } = req.body;

//   if (!mobile || !otp || !role) {
//     return res.status(400).json({ error: "Mobile, OTP and role are required" });
//   }

//   const valid = verifyOtpCode(mobile, otp);
//   if (!valid) return res.status(400).json({ error: "Invalid OTP" });

//   let user = await User.findOne({ mobile });

//   if (user) {
//     if (user.role !== role) {
//       return res.status(403).json({ error: "Role mismatch. Unauthorized login." });
//     }
//   } else {
//     user = await User.create({
//       mobile,
//       role,
//       location: {
//         type: "Point",
//         coordinates: [0, 0],
//       },
//     });
//   }

//   user.isVerified = true;
//   await user.save();

//   const token = generateToken(user._id);
//   res.json({ token, user });
// };




// controllers/authController.js

import User from "../models/User.js";
import { generateToken } from "../utils/tokenService.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
  });

  const token = generateToken(user._id);
  res.status(201).json({ token, user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if blocked
    if (user.blocked) {
      return res.status(403).json({ error: "Your account has been blocked by the admin." });
    }

    // Generate token
    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

