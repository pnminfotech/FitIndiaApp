import Booking from '../models/Booking.js';
import Venue from '../models/VenueModel.js';

import BlockedSlot from '../models/BlockedSlot.js'; // Make sure this is imported

export const createBooking = async (req, res) => {
  try {
    const { venueId, courtId, courtName, date, startTime, endTime } = req.body;

    // ✅ Step 1: Check if slot is already booked (you likely already have this)
    const alreadyBooked = await Booking.findOne({
      venueId,
      courtId,
      date,
      startTime,
      endTime,
      status: "booked",
    });

    if (alreadyBooked) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // ✅ Step 2: Check if slot is blocked by admin
    const isBlocked = await BlockedSlot.findOne({
      venueId,
      courtId,
      date,
      startTime,
      endTime,
    });

    if (isBlocked) {
      return res.status(400).json({ message: "Slot has been blocked by the admin" });
    }

    // ✅ Step 3: Proceed to create booking if not blocked
    const newBooking = await Booking.create({
      userId: req.user.id, // assuming you’re using auth middleware
      venueId,
      courtId,
      courtName,
      date,
      startTime,
      endTime,
      status: "booked",
    });

    res.status(201).json(newBooking);
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ message: "Server error while booking slot" });
  }
};


// GET /api/bookings/:venueId/:courtId
export const getCourtBookings = async (req, res) => {
  try {
    const { venueId, courtId } = req.params;
    const bookings = await Booking.find({
      venueId,
      courtId,
      status: 'booked',
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId }).populate('venueId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const cancelBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error("Cancel booking failed:", err.message);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('venueId userId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all bookings" });
  }
};
