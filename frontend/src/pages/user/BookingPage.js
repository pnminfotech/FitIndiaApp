import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, Dribbble, Target, Trophy, Info } from "lucide-react";
import moment from "moment";

const BookingPage = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null); // Corrected this line in the previous revision
  const [allSlots, setAllSlots] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);

  const token = localStorage.getItem("token");

  // Generate date strip for 30 days
  useEffect(() => {
    const today = moment();
    const upcoming = [];
    for (let i = 0; i < 30; i++) {
      upcoming.push(today.clone().add(i, "days"));
    }
    setDates(upcoming);
  }, []);

  // Fetch venue details and set initial selections
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/venues");
        const data = await res.json();
        const found = data.find((v) => v._id === venueId);
        setVenue(found);
        if (found && found.courts.length > 0) {
          setSelectedCourt(found.courts[0]); // Auto-select first court
          if (found.courts[0].sports.length > 0) {
            setSelectedSport(found.courts[0].sports[0]); // Auto-select first sport
          }
        }
        setSelectedDate(moment().format("YYYY-MM-DD")); // Auto-select today's date
      } catch (err) {
        console.error("Failed to fetch venue", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [venueId]);

  // Normalize time string for comparison
  const cleanTime = (timeStr) => timeStr?.trim().toLowerCase();

  // Determine if a slot is available (not blocked and not booked)
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

  // Handle court selection change
  const handleCourtChange = (court) => {
    setSelectedCourt(court);
    setSelectedSport(court.sports[0] || ""); // Reset sport for the new court
    setSelectedSlot(null); // Reset selected slot
    setAllSlots([]); // Clear slots
    setBookings([]); // Clear bookings
    setBlockedSlots([]); // Clear blocked slots
    setBookingSuccess(false); // Reset success message
  };

  // Fetch available slots for selected court and date
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
  }, [selectedCourt?._id, selectedDate, venueId]);

  // Fetch existing bookings for selected court and date
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
  }, [selectedCourt?._id, selectedDate, venueId]);

  // Fetch blocked slots for selected court and date
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
  }, [selectedCourt?._id, selectedDate, venueId]);

  // Handle booking confirmation and navigation
  const handleBookSlot = async () => {
    if (!selectedCourt || !selectedSlot || !selectedDate || !selectedSport) {
      alert("Please select a court, sport, date, and time slot to proceed.");
      return;
    }

    // Pass data to confirmation page, actual booking happens there
    navigate("/user/booking-confirmation", {
      state: {
        bookingData: {
          venue,
          selectedDate,
          selectedCourt,
          selectedSlots: [selectedSlot], // Pass the single selected slot as an array
          totalPrice: selectedSlot.price || 0,
          sports: selectedSport,
        },
      },
    });
    setBookingSuccess(true); // This will only briefly show if navigation is slow
  };

  // Loading state UI
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading venue details...</p>
      </div>
    );

  // Venue not found UI
  if (!venue)
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm w-full">
          <p className="text-red-600 text-xl font-semibold mb-4">
            <Info size={30} className="inline-block mr-2 text-red-500" /> Venue not found 😔
          </p>
          <p className="text-gray-600 mb-6">
            The venue you are looking for might not exist or is unavailable.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 font-sans">
      {/* Header with Venue Name and Back Button */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
        >
           {/* Back Button */}
      <div className="absolute top-4 right-4 z-[1002] sm:top-6 sm:right-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg text-blue-600 hover:bg-blue-100 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

        </button>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 text-center flex-grow">
          {venue.name}
        </h1>
        <div className="w-10 sm:w-auto"></div> {/* Spacer for alignment */}
      </div>

      {/* Court Selection Section */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-5 mb-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
          <Trophy size={28} className="text-blue-600" /> Choose Your Arena
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {venue.courts.map((court) => (
            <div
              key={court._id}
              className={`rounded-xl p-3 border-2 cursor-pointer transition-all duration-300 ease-in-out
                ${
                  selectedCourt?._id === court._id
                    ? "border-blue-600 bg-blue-50 shadow-md scale-[1.02]"
                    : "border-gray-200 bg-gray-50 hover:border-blue-200 hover:shadow-sm"
                }`}
              onClick={() => handleCourtChange(court)}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {court.courtName}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Suitable for:{" "}
                <span className="font-medium text-gray-800">
                  {court.sports.join(", ")}
                </span>
              </p>
              {selectedCourt?._id === court._id && (
                <div className="mt-3 pt-0 border-t border-gray-200">
                  <p className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Dribbble size={18} className="text-blue-500" /> Select a Sport:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {court.sports.map((sport) => (
                      <label
                        key={sport}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer
                          ${
                            selectedSport === sport
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                      >
                        <input
                          type="radio"
                          name={`sport-${court._id}`}
                          value={sport}
                          checked={selectedSport === sport}
                          onChange={() => setSelectedSport(sport)}
                          className="hidden"
                        />
                        <span>{sport}</span>
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
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 mb-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
            <CalendarDays size={28} className="text-blue-600" /> Pick a Date
          </h2>
          <div className="flex overflow-x-auto space-x-3 pb-3 custom-scrollbar"> {/* Reduced space-x to space-x-3 */}
            {dates.map((dateObj, index) => {
              const formattedDate = dateObj.format("YYYY-MM-DD");
              const isSelected = selectedDate === formattedDate;
              const isToday = dateObj.isSame(moment(), "day");
              const isFirstOfMonth =
                index === 0 ||
                dateObj.format("MMMM") !== dates[index - 1].format("MMMM");

              return (
                <React.Fragment key={index}>
                  {isFirstOfMonth && (
                    <div className="flex flex-col items-center justify-center min-w-[60px] sm:min-w-[70px] bg-blue-100 border-l border-blue-200 rounded-l-lg pr-2 py-2 text-xs font-semibold text-blue-800 flex-shrink-0"> {/* Adjusted min-w */}
                      <span className="uppercase text-center text-sm">
                        {dateObj.format("MMM")}
                      </span>
                      <span className="text-xs">{dateObj.format("YYYY")}</span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setSelectedDate(formattedDate);
                      setSelectedSlot(null);
                      setBookingSuccess(false);
                    }}
                    className={`min-w-[60px] h-20 sm:min-w-[70px] sm:h-24 p-2 rounded-xl border-2 flex flex-col items-center justify-center flex-shrink-0 transition-all duration-200 ease-in-out
                      ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.05]"
                          : "bg-white text-gray-800 border-gray-200 hover:border-blue-300 hover:shadow-sm"
                      }`}
                  > {/* Adjusted min-w and h */}
                    <div className="text-xs font-medium"> {/* Adjusted font size */}
                      {dateObj.format("ddd")}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold"> {/* Adjusted font size */}
                      {dateObj.format("D")}
                    </div>
                    {isToday && ( // FIX: Removed the extra parenthesis here
                      <div className="text-[10px] mt-1 text-blue-200">Today</div>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Slot Selection Section */}
      {selectedCourt && selectedSport && selectedDate && (
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-7 mb-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-3">
            <Clock size={28} className="text-blue-600" /> Select Your Time Slot
          </h2>
          {/* Changed grid-cols-2 to grid-cols-1 for small screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {allSlots.filter(isSlotAvailable).length > 0 ? (
              allSlots.filter(isSlotAvailable).map((slot, index) => {
                const isSelected =
                  selectedSlot?.startTime === slot.startTime &&
                  selectedSlot?.endTime === slot.endTime;

                return (
                  <button
                    key={index}
                    className={`rounded-xl border-2 p-3 text-center transition-all duration-200 ease-in-out flex flex-col justify-center items-center
                      ${
                        isSelected
                          ? "bg-indigo-400 text-white border-indigo-600 shadow-md scale-[1.02]"
                          : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:shadow-sm cursor-pointer"
                      }`}
                    onClick={() => setSelectedSlot(slot)}
                  > {/* Reduced padding to p-3 */}
                    <div className="font-semibold text-base"> {/* Reduced font size to text-base */}
                      {moment(slot.startTime, "HH:mm").format("h:mm A")} -{" "}
                      {moment(slot.endTime, "HH:mm").format("h:mm A")}
                    </div>
                    <div className="text-sm font-bold mt-1 text-red-900">
                      ₹{slot.price || 0}
                    </div>
                    <div className="text-xs mt-2 text-gray-800">
                      {isSelected ? "Selected" : "Available"}
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-red-500 col-span-full text-center py-4 text-lg">
                <Target size={30} className="inline-block mr-2 text-red-400" />
                No slots available for this date and court.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar for Booking Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 sm:p-6 border-t border-gray-200 shadow-2xl z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-col sm:flex-row gap-4">
          <div className="text-center sm:text-left">
            {selectedSlot ? (
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                Total: ₹{selectedSlot.price || 0}{" "}
                <span className="text-sm font-normal text-gray-600">
                  (for {moment(selectedSlot.startTime, "HH:mm").format("h:mm A")} - {moment(selectedSlot.endTime, "HH:mm").format("h:mm A")})
                </span>
              </p>
            ) : (
              <p className="text-lg sm:text-xl font-bold text-gray-700">
                Select a slot to see price
              </p>
            )}
          </div>
          <button
            onClick={handleBookSlot}
            disabled={!selectedSlot}
            className={`w-full sm:w-auto px-8 py-3 rounded-lg shadow-lg font-semibold text-base sm:text-lg transition duration-300 ease-in-out transform active:scale-95
              ${
                selectedSlot
                  ? "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            PROCEED TO BOOK
          </button>
        </div>
      </div>

      {/* Booking Success Message (optional, consider a toast library for better UX) */}
      {bookingSuccess && (
        <div className="fixed bottom-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-xl animate-fade-in-up">
          ✅ Booking process initiated!
        </div>
      )}

      {/* Global Scrollbar Style (add this to your main CSS file or index.css) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px; /* For horizontal scrollbars */
          width: 8px; /* For vertical scrollbars */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        @keyframes fadeInMoveUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInMoveUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BookingPage;