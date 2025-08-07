import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"; // Adjust path if needed
import { FaBars } from "react-icons/fa"; // Still using FaBars for sidebar toggle
import Header from "../../components/Header"; // Assuming this is your global header component
// Importing Lucide icons for a consistent, professional look
import {
  CalendarDays,
  Clock,
  MapPin,
  Tag,
  Hourglass,
  CheckCircle,
  XCircle,
  Info,
  ArrowRight,
  ChevronRight,
  Building,
  Activity,
  Wallet, // For total price
  ListTodo, // For a list icon for bookings
  History, // For previous bookings
  RefreshCcw // For refresh/reload (optional)
} from "lucide-react";
import moment from "moment"; // For better date/time formatting

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true); // Ensure loading is true when fetching
      try {
        const res = await fetch("https://api.getfitindia.in/api/bookings/mybookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          // Sort bookings: upcoming first, then past/cancelled, by date/time
          const sortedBookings = data.sort((a, b) => {
            const dateA = new Date(`${a.date?.slice(0, 10)}T${a.startTime}`);
            const dateB = new Date(`${b.date?.slice(0, 10)}T${b.startTime}`);
            return dateA - dateB; // Ascending order
          });
          setBookings(sortedBookings);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setBookings([]);
        // Consider showing an error toast/message to the user
      } finally {
        setLoading(false);
      }
    };

    if (token) { // Only fetch if token exists
      fetchBookings();
    } else {
        setLoading(false); // If no token, no bookings to load
        // Optionally navigate to login or show a message
    }
  }, [token]);

  const now = new Date();
  const parseDateTime = (b) => new Date(`${b.date?.slice(0, 10)}T${b.startTime}`);

  const upcoming = bookings.filter(
    (b) => parseDateTime(b) >= now && b.status === "booked"
  );
  const past = bookings.filter(
    (b) => parseDateTime(b) < now || b.status === "cancelled" || b.status === "completed"
  );

  const cancelBooking = async (id) => {
    const confirmCancellation = window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.");
    if (!confirmCancellation) return;

    try {
      const res = await fetch(`https://api.getfitindia.in/api/bookings/cancel/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to cancel booking. Please try again.");

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
      alert("Booking cancelled successfully.");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const BookingCard = ({ booking }) => {
    const isCancelable = booking.status === "booked" && parseDateTime(booking) >= now;

    // Use moment for robust date/time formatting
    const formattedDate = moment(booking.date).format("MMM Do, YYYY");
    const formattedTime = `${moment(booking.startTime, "HH:mm").format("h:mm A")} - ${moment(booking.endTime, "HH:mm").format("h:mm A")}`;

    let statusColor = "";
    let statusText = "";
    let statusIcon = null;

    if (booking.status === "booked") {
      statusColor = "text-green-600";
      statusText = "Confirmed";
      statusIcon = <CheckCircle size={18} />;
    } else if (booking.status === "cancelled") {
      statusColor = "text-orange-600";
      statusText = "Cancelled";
      statusIcon = <XCircle size={18} />;
    } else if (booking.status === "completed") {
      statusColor = "text-orange-600"; // Or gray/purple
      statusText = "Completed";
      statusIcon = <History size={18} />;
    } else {
      statusColor = "text-gray-500";
      statusText = "Pending"; // Or other custom status
      statusIcon = <Hourglass size={18} />;
    }

    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-start md:items-center p-6 space-y-4 md:space-y-0 md:space-x-6 border border-gray-100">
        {/* Left Section: Details */}
        <div className="flex-grow space-y-2">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <Building size={22} className="text-orange-700" />
            {booking.venueId?.name || "Unknown Venue"}
          </h3>
          <div className="text-gray-600 text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p className="flex items-center gap-2">
              <MapPin size={16} className="text-orange-700" />
              Court: <span className="font-semibold">{booking.courtName}</span>
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays size={16} className="text-orange-700" />
              Date: <span className="font-semibold">{formattedDate}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock size={16} className="text-orange-700" />
              Time: <span className="font-semibold">{formattedTime}</span>
            </p>
            <p className="flex items-center gap-2">
              <Activity size={16} className="text-orange-700" />
              Sport: <span className="font-semibold capitalize">{booking.sports}</span>
            </p>
            
          </div>
        </div>

        {/* Right Section: Status & Action Button */}
        <div className="flex flex-col items-start md:items-end space-y-3">
          <p className={`text-sm font-bold flex items-center gap-2 px-3 py-1 rounded-full ${statusColor} bg-opacity-10`} style={{backgroundColor: `${statusColor.replace('text-', '')}-100`}}>
             {statusIcon} {statusText}
          </p>
          {isCancelable && (
            <button
              onClick={() => cancelBooking(booking._id)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75"
            >
              <XCircle size={18} /> Cancel Booking
            </button>
          )}
        </div>
      </div>
    );
  };

  // --- Loading State UI ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center font-sans p-6">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-xl border border-gray-200">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Loading your bookings...</p>
          <p className="text-md text-gray-500 mt-2">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Header component (if it manages its own position/responsiveness) */}
      
 <div className="fixed top-4 left-4 z-[1003]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 bg-white rounded-full shadow-lg text-orange-600 hover:bg-orange-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          aria-label="Open sidebar"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Sidebar */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Back Button */}
      <div className="absolute top-4 right-4 z-[1002] sm:top-6 sm:right-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg text-orange-600 hover:bg-orange-100 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
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
      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Desktop Sidebar (if applicable, uncomment and adjust styling) */}
        {/* <div className="hidden md:block w-64 bg-white shadow-xl">
            <Sidebar isDesktop={true} /> // Pass a prop to Sidebar to adjust its desktop layout
        </div> */}

        <div className="flex-1 p-6 sm:p-8 md:p-10 max-w-7xl mx-auto w-full mt-16 md:mt-0"> {/* Adjusted top margin for header/sidebar toggle */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-gray-200">
            <h2 className="text-sm md:text-md lg:text-lg font-extrabold text-gray-900 mb-8 flex items-center gap-4">
              <ListTodo size={40} className="text-orange-600" /> Your Bookings
            </h2>

            {/* Tab Navigation */}
           {/* Tab Navigation */}
<div className="grid grid-cols-1 sm:flex sm:space-x-4 gap-3 mb-8 border-b-2 border-gray-100 pb-3">
  <button
    onClick={() => setActiveTab("upcoming")}
    className={`w-full sm:w-auto px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ease-in-out shadow-sm
      ${
        activeTab === "upcoming"
          ? "bg-orange-600 text-white shadow-md hover:bg-orange-700"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
  >
    <span className="flex items-center justify-center gap-2">
      <Hourglass size={18} /> Upcoming ({upcoming.length})
    </span>
  </button>
  <button
    onClick={() => setActiveTab("previous")}
    className={`w-full sm:w-auto px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ease-in-out shadow-sm
      ${
        activeTab === "previous"
          ? "bg-orange-600 text-white shadow-md hover:bg-orange-700"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
  >
    <span className="flex items-center justify-center gap-2">
      <History size={18} /> Past & Cancelled ({past.length})
    </span>
  </button>
</div>


            {/* Booking List Display */}
            <div className="space-y-6">
              {activeTab === "upcoming" && (
                <>
                  {upcoming.length === 0 ? (
                    <div className="py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-600">
                      <Info size={40} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-xl font-medium mb-2">No Upcoming Bookings</p>
                      <p className="text-md">
                        Looks like your schedule is free! Head to the{" "}
                        <button onClick={() => alert("Navigate to venues page")} className="text-orange-600 hover:underline font-semibold">
                          Venues
                        </button>{" "}
                        page to book your next slot.
                      </p>
                    </div>
                  ) : (
                    upcoming.map((b) => <BookingCard key={b._id} booking={b} />)
                  )}
                </>
              )}

              {activeTab === "previous" && (
                <>
                  {past.length === 0 ? (
                    <div className="py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-600">
                      <Info size={40} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-xl font-medium mb-2">No Past or Cancelled Bookings</p>
                      <p className="text-md">
                        Your booking history is empty. Start playing today!
                      </p>
                    </div>
                  ) : (
                    past.map((b) => <BookingCard key={b._id} booking={b} />)
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;