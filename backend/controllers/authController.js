import User from "../models/User.js";
import { generateToken } from "../utils/tokenService.js";
import axios from "axios";

// ------------------ Admin Register ------------------
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ error: "Email already exists" });

  const user = await User.create({
    name,
    email,
    password,
    role: role || "admin",
  });

  const token = generateToken(user._id);
  res.status(201).json({ token, user });
};

// ------------------ Admin Login ------------------
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role: "admin" });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    if (user.blocked)
      return res
        .status(403)
        .json({ error: "Your account has been blocked by the admin." });

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

// ------------------ User OTP Request ------------------
export const requestOtp = async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ error: "Mobile number is required" });

  let user = await User.findOne({ mobile });

  // 👇 Replace your User.create() with this
  if (!user) {
    user = new User();
    user.mobile = mobile;
    user.role = "user";
    user.name = "";   // ⚡ keep name empty if you want
    await user.save();   // ✅ this prevents email:null issue
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  // Send OTP via MSG91
  try {
    const msg91AuthKey = "467058AamYR7TNS68becab8P1"; // replace with your key
    const templateId = "68bec9afc336f4175e41c3cf";      // replace with your template
    const url = `https://api.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${mobile}&authkey=${msg91AuthKey}&otp=${otp}`;

    const response = await axios.get(url);
    console.log("MSG91 Response:", response.data);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("MSG91 Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};
// ------------------ User OTP Verify ------------------
export const verifyOtp = async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp)
    return res.status(400).json({ error: "Mobile and OTP are required" });

  const user = await User.findOne({ mobile, role: "user" });
  if (!user) return res.status(400).json({ error: "User not found" });

  if (!user.otp || !user.otpExpires || user.otpExpires < Date.now())
    return res.status(400).json({ error: "OTP expired or not requested" });

  if (user.otp.toString() !== otp.toString())
    return res.status(400).json({ error: "Invalid OTP" });

  // Clear OTP
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  const token = generateToken(user._id);
  res.json({ token, user });
};















// login by email
// // controllers/authController.js

// import User from "../models/User.js";
// import { generateToken } from "../utils/tokenService.js";

// export const register = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password required" });
//   }

//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res.status(400).json({ error: "Email already exists" });
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//     role,
//     location: {
//       type: "Point",
//       coordinates: [0, 0],
//     },
//   });

//   const token = generateToken(user._id);
//   res.status(201).json({ token, user });
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     // Check if user exists
//     if (!user) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     // Check password
//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) {
// //       return res.status(401).json({ error: "Invalid email or password" });
// //     }

//     // Check if blocked
//     if (user.blocked) {
//       return res.status(403).json({ error: "Your account has been blocked by the admin." });
//     }

//     // Generate token
//     const token = generateToken(user._id);
//     res.json({ token, user });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: "Server error during login" });
//   }
// };







// // for admin and user login 


// import User from "../models/User.js";
// import { generateToken } from "../utils/tokenService.js";
// import bcrypt from "bcrypt";

// /* ✅ Register Admin/Coach (email + password) */
// export const registerAdminCoach = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password required" });
//     }

//     if (!["admin", "coach"].includes(role)) {
//       return res.status(400).json({ error: "Role must be admin or coach" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "Email already exists" });
//     }

//     const user = await User.create({ name, email, password, role });
//     const token = generateToken(user._id);

//     res.status(201).json({ token, user });
//   } catch (err) {
//     console.error("Register error:", err);
//     res.status(500).json({ error: "Server error during registration" });
//   }
// };

// /* ✅ Login Admin/Coach */
// export const loginAdminCoach = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email, role: { $in: ["admin", "coach"] } });
//     if (!user) return res.status(401).json({ error: "Invalid email or password" });

//     const isMatch = await user.matchPassword(password);
//     if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

//     if (user.blocked) return res.status(403).json({ error: "Your account has been blocked" });

//     const token = generateToken(user._id);
//     res.json({ token, user });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: "Server error during login" });
//   }
// };

// /* ✅ Send OTP to User (mobile login) */
// export const sendOtp = async (req, res) => {
//   try {
//     const { mobile } = req.body;
//     if (!mobile) return res.status(400).json({ error: "Mobile number required" });

//     let user = await User.findOne({ mobile });
//     if (!user) {
//       user = await User.create({ mobile, role: "user" });
//     }

//     // Generate OTP (6 digits)
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     user.otp = otp;
//     user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
//     await user.save();

//     // In production: send OTP via SMS (Twilio, MSG91, etc.)
//     console.log(`OTP for ${mobile} is ${otp}`);

//     res.json({ message: "OTP sent successfully" });
//   } catch (err) {
//     console.error("Send OTP error:", err);
//     res.status(500).json({ error: "Server error during OTP sending" });
//   }
// };

// /* ✅ Verify OTP (user login) */
// export const verifyOtp = async (req, res) => {
//   try {
//     const { mobile, otp } = req.body;

//     const user = await User.findOne({ mobile, role: "user" });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     if (user.otp !== otp || Date.now() > user.otpExpires) {
//       return res.status(400).json({ error: "Invalid or expired OTP" });
//     }

//     // clear OTP
//     user.otp = null;
//     user.otpExpires = null;
//     await user.save();

//     const token = generateToken(user._id);
//     res.json({ token, user });
//   } catch (err) {
//     console.error("Verify OTP error:", err);
//     res.status(500).json({ error: "Server error during OTP verification" });
//   }
// };
