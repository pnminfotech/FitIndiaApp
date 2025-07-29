import express from 'express';
import { createBooking, getUserBookings, cancelBooking, getAllBookings } from '../controllers/bookingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { isAdmin } from "../middlewares/roleMiddleware.js";
const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/mybookings", authMiddleware, getUserBookings);
router.put("/cancel/:id", authMiddleware, cancelBooking);
// (optional: admin only)
// router.get("/all", authMiddleware, getAllBookings); 



router.get("/all", authMiddleware, isAdmin, getAllBookings);

export default router;
