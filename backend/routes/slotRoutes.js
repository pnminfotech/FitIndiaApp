import express from 'express';
import {
  getAllCourts,        // ✅ new
  getSlotsOfCourt,     // ✅ new
  createCourt,
  updateCourt,
  deleteCourt
} from '../controllers/slotController.js';
import { getCourtBookings } from '../controllers/bookingController.js';
import {getAvailableSlots} from '../controllers/userController.js';
// import {blockSlot, unblockSlot} from '../controllers/blockController.js'
const slotRouter = express.Router();

// Admin: Get all courts in a venue
slotRouter.get("/:venueId/courts", getAllCourts);
slotRouter.post("/:venueId/courts", createCourt);
slotRouter.put("/:venueId/courts/:courtId", updateCourt);
slotRouter.delete("/:venueId/courts/:courtId", deleteCourt);

// Booking: Get all slots for a court (raw court slots)
slotRouter.get("/:venueId/:courtId/slots", getSlotsOfCourt);

// Booking: Get bookings for a court
slotRouter.get("/:venueId/:courtId/bookings", getCourtBookings);

// Booking: Get available slots for a court and date
slotRouter.get("/:venueId/:courtId/available", getAvailableSlots);


export default slotRouter;
