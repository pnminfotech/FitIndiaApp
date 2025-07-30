import Booking from '../models/Booking.js';
import Venue from '../models/VenueModel.js';

import BlockedSlot from '../models/BlockedSlot.js'; // Make sure this is imported

export const createBooking = async (req, res) => {
  console.log("🧾 Incoming Booking Payload:", req.body);

  try {
    const {
      venueId,
      courtId,
      courtName,
      date,
      selectedSlots, // array of slots from frontend
    } = req.body;

    const userId = req.user.id;
    const bookingsToSave = [];

    for (const slot of selectedSlots) {
      const { startTime, endTime } = slot;

      // Check if slot is already booked
      const alreadyBooked = await Booking.findOne({
        venueId,
        courtId,
        date,
        startTime,
        endTime,
        status: "booked",
      });

      if (alreadyBooked) {
        return res.status(400).json({
          message: `Slot from ${startTime} to ${endTime} is already booked.`,
        });
      }

      // Check if slot is blocked
      const isBlocked = await BlockedSlot.findOne({
        venueId,
        courtId,
        date,
        startTime,
        endTime,
      });

      if (isBlocked) {
        return res.status(400).json({
          message: `Slot from ${startTime} to ${endTime} is blocked by admin.`,
        });
      }

      // If not booked or blocked, prepare to save it
      bookingsToSave.push({
        userId,
        venueId,
        courtId,
        courtName,
        date,
        startTime,
        endTime,
        price: slot.price || 0,
        status: "booked",
      });
    }

    // Save all valid bookings in one go
    const savedBookings = await Booking.insertMany(bookingsToSave);

    res.status(201).json(savedBookings);
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ message: "Server error while booking slots" });
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
