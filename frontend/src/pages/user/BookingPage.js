import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import moment from "moment";

const BookingPage = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [allSlots, setAllSlots] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);

  const token = localStorage.getItem("token");

  // Generate date strip
  useEffect(() => {
    const today = moment();
    const upcoming = [];

    for (let i = 0; i < 14; i++) {
      upcoming.push(today.clone().add(i, "days"));
    }
    setDates(upcoming);
  }, []);

  // Fetch venue
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/venues");
        const data = await res.json();
        const found = data.find((v) => v._id === venueId);
        setVenue(found);
      } catch (err) {
        console.error("Failed to fetch venue", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [venueId]);

  // Normalize time string
  const cleanTime = (timeStr) => timeStr?.trim().toLowerCase();

  // Determine if slot is available
  const isSlotAvailable = (slot) => {
    const isBlocked = blockedSlots.some(
      (b) =>
        cleanTime(b.startTime) === cleanTime(slot.startTime) &&
        cleanTime(b.endTime) === cleanTime(slot.endTime)
    );

    const isBooked = bookings.some((b) => {
      const bookingDate = new Date(b.date).toISOString().slice(0, 10);
      return (
        bookingDate === selectedDate &&
        cleanTime(b.startTime) === cleanTime(slot.startTime) &&
        cleanTime(b.endTime) === cleanTime(slot.endTime) &&
        b.status === "booked"
      );
    });

    return !isBlocked && !isBooked;
  };

  // Change selected court
  const handleCourtChange = async (court) => {
    setSelectedCourt(court);
    setSelectedSlot(null);
    setAllSlots([]);
    setSelectedDate("");
  };

  // Fetch available slots
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedCourt || !selectedDate) return;

      try {
        const res = await fetch(
          `http://localhost:8000/api/slots/${venueId}/${selectedCourt._id}/available?date=${selectedDate}`
        );
        if (!res.ok) throw new Error("Failed to fetch available slots");

        const data = await res.json();
        setAllSlots(data);
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setAllSlots([]);
      }
    };

    fetchAvailableSlots();
  }, [selectedCourt?._id, selectedDate]);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedCourt || !selectedDate) return;
      try {
        const res = await fetch(
          `http://localhost:8000/api/slots/${venueId}/${selectedCourt._id}/bookings?date=${selectedDate}`
        );
        if (!res.ok) {
          console.error("Booking fetch error status:", res.status);
          return;
        }
        const data = await res.json();
        setBookings(data || []);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };
    fetchBookings();
  }, [selectedCourt, selectedDate]);

  // Fetch blocked slots
  useEffect(() => {
    const fetchBlocked = async () => {
      if (!selectedCourt || !selectedDate) return;
      try {
        const res = await fetch(
          `http://localhost:8000/api/block/${venueId}/${selectedCourt._id}?date=${selectedDate}`
        );
        const data = await res.json();
        setBlockedSlots(data || []);
      } catch (err) {
        console.error("Failed to fetch blocked slots:", err);
      }
    };
    fetchBlocked();
  }, [selectedCourt?._id, selectedDate]);

  // Handle slot booking
  const handleBookSlot = async () => {
    if (!selectedCourt || !selectedSlot || !selectedDate) return;
    try {
      const res = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          venueId,
          courtId: selectedCourt._id,
          courtName: selectedCourt.courtName,
          date: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        }),
      });

      if (!res.ok) throw new Error("Booking failed");
      setBookingSuccess(true);
    } catch (err) {
      alert(err.message || "Failed to book the slot.");
    }
  };

  if (loading) return <p className="text-center py-10">Loading…</p>;
  if (!venue) return <p className="text-center py-10 text-red-500">Venue not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">{venue.name}</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-800 hover:underline"
        >
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      {/* Court Selection */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Select a Court</h3>
        <div className="flex flex-wrap gap-4">
          {venue.courts.map((court) => (
            <div key={court._id} className="mb-4">
              <button
                onClick={() => handleCourtChange(court)}
                className={`w-full px-4 py-2 rounded-lg font-medium text-left border transition ${
                  selectedCourt?._id === court._id
                    ? "bg-blue-800 text-white border-blue-800"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {court.courtName}
              </button>

              {selectedCourt?._id === court._id && (
                <div className="mt-3 ml-2">
                  <p className="font-medium text-sm text-gray-700 mb-1">Select a Sport:</p>
                  <div className="flex flex-wrap gap-3">
                    {court.sports.map((sport) => (
                      <label key={sport} className="inline-flex items-center space-x-2">
                        <input
                          type="radio"
                          name="selectedSport"
                          value={sport}
                          checked={selectedSport === sport}
                          onChange={() => setSelectedSport(sport)}
                          className="form-radio text-blue-800"
                        />
                        <span className="text-sm text-gray-800">{sport}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Strip */}
      {selectedCourt && selectedSport && (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Select a Date</h3>
          <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
            {dates.map((dateObj, index) => {
              const formattedDate = dateObj.format("YYYY-MM-DD");
              const isSelected = selectedDate === formattedDate;
              const isToday = dateObj.isSame(moment(), "day");

              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDate(formattedDate);
                    setSelectedSlot(null);
                    setBookingSuccess(false);
                  }}
                  className={`min-w-[60px] p-2 rounded-lg border text-center flex-shrink-0
                    ${isSelected ? "bg-blue-800 text-white" : "bg-white text-gray-800"}
                    ${isToday ? "border-blue-800 font-bold" : "border-gray-300"}
                  `}
                >
                  <div className="text-xs">{dateObj.format("ddd")}</div>
                  <div className="text-lg">{dateObj.format("D")}</div>
                  {isToday && <div className="text-[10px] text-green-600">Today</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Slot Selection */}
      {selectedDate && allSlots && (
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Select a Slot</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
            {allSlots.filter(isSlotAvailable).map((slot, index) => {
              const isSelected =
                selectedSlot?.startTime === slot.startTime &&
                selectedSlot?.endTime === slot.endTime;

              return (
                <div
                  key={index}
                  className={`rounded border p-3 text-center transition-all ${
                    isSelected
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <div className="font-medium">
                    {slot.startTime} - {slot.endTime}  
                    <div className="text-sm font-semibold text-gray-700 mt-1">
  ₹{slot.price || 0}
</div>
                  </div>
                  <div className="text-xs mt-1 text-green-600">Available</div>
                </div>
              );
            })}
            {allSlots.filter(isSlotAvailable).length === 0 && (
              <p className="text-red-500 col-span-full text-center">
                No slots available for this date.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Confirm Booking */}
      {selectedSlot && selectedDate && (
        <div className="mt-6 text-center">
          <button
            onClick={handleBookSlot}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg"
          >
            Confirm Booking
          </button>
        </div>
      )}

      {/* Booking Success */}
      {bookingSuccess && (
        <p className="text-green-600 mt-6 font-semibold text-center animate-bounce">
          ✅ Slot booked successfully!
        </p>
      )}
    </div>
  );
};

export default BookingPage;
