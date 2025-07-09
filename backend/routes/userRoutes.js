// routes/userRoutes.js
import express from "express";
import { getMe, updateMe,getAllUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { updateUserLocation } from "../controllers/userController.js";
const router = express.Router();
router.get("/", authMiddleware, getAllUsers);


router.get("/me", authMiddleware, getMe); 
router.put("/me", authMiddleware, updateMe);
router.post("/location", authMiddleware, updateUserLocation);

export default router; // ✅ ES module default export
