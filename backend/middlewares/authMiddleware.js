// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const authMiddleware = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ error: "User not found" });
//     }

//     // 🚨 Blocked user check
//     if (user.blocked) {
//       return res
//         .status(403)
//         .json({ error: "Your account is blocked. Please contact admin." });
//     }

//     req.user = user; // ✅ Set req.user
//     next();
//   } catch (err) {
//     console.error("JWT error:", err.message);
//     return res.status(401).json({ error: "Invalid token" });
//   }
// };



// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const { JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE } = process.env;

if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");
if (!JWT_ISSUER) throw new Error("JWT_ISSUER is not set");
if (!JWT_AUDIENCE) throw new Error("JWT_AUDIENCE is not set");

const AUDIENCE = JWT_AUDIENCE.split(",").map(s => s.trim()).filter(Boolean);

export const authMiddleware = (requiredRole = null) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.slice(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: ["HS256"],
        issuer: JWT_ISSUER,
        audience: AUDIENCE.length === 1 ? AUDIENCE[0] : AUDIENCE,
        clockTolerance: 5,
      });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ error: "User not found" });
      if (user.blocked) return res.status(403).json({ error: "Your account is blocked" });

      if (decoded.role && decoded.role !== user.role) {
        return res.status(403).json({ error: "Role mismatch" });
      }

      if (requiredRole) {
        if (requiredRole === "user" && !["user", "admin"].includes(user.role)) {
          return res.status(403).json({ error: "Forbidden" });
        }
        if (requiredRole === "admin" && user.role !== "admin") {
          return res.status(403).json({ error: "Forbidden" });
        }
      }

      req.user = user;
      req.auth = decoded;
      next();
    } catch (err) {
      console.error("JWT verify error:", err.message);
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};
