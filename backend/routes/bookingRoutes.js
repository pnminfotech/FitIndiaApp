import express from 'express';
import { createBooking, getUserBookings, cancelBooking, getAllBookings } from '../controllers/bookingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, createBooking);
router.get("/mybookings", authMiddleware, getUserBookings);
router.put("/cancel/:id", authMiddleware, cancelBooking);
router.get("/all", authMiddleware, getAllBookings); // (optional: admin only)

export default router;
