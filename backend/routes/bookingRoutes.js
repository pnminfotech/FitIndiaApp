// import express from 'express';
// import { createBooking, getUserBookings, cancelBooking, getAllBookings,cancelPendingBookings } from '../controllers/bookingController.js';
// import { authMiddleware } from '../middlewares/authMiddleware.js';
// import { isAdmin } from "../middlewares/roleMiddleware.js";
// const router = express.Router();

// router.post("/", authMiddleware, createBooking);
// router.get("/mybookings", authMiddleware, getUserBookings);
// router.put("/cancel/:id", authMiddleware, cancelBooking);
// // (optional: admin only)
// // router.get("/all", authMiddleware, getAllBookings); 



// router.get("/all", authMiddleware, isAdmin, getAllBookings);
// router.post("/cancel-pending", authMiddleware, cancelPendingBookings);
// export default router;




import express from 'express';
import {
  getUserBookings,
  cancelBooking,
  getAllBookings,
  cancelPendingBookings,
  createRazorpayOrder,
  confirmBookingAfterPayment
} from '../controllers/bookingController.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// 🔄 OLD flow (remove/comment this out)
// router.post("/", authMiddleware, createBooking);

// ✅ New flow
router.post("/create-order", authMiddleware, createRazorpayOrder);
router.post("/confirm-payment", authMiddleware, confirmBookingAfterPayment);

router.get("/mybookings", authMiddleware, getUserBookings);
router.put("/cancel/:id", authMiddleware, cancelBooking);

// Admin only
router.get("/all", authMiddleware, isAdmin, getAllBookings);

router.post("/cancel-pending", authMiddleware, cancelPendingBookings);

export default router;
