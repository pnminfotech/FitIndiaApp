import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar"; // Adjust path if needed
import { FaBars } from "react-icons/fa";
import Header from "../../components/Header";
const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/bookings/mybookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("Failed to load bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const now = new Date();
  const parseDateTime = (b) => new Date(`${b.date?.slice(0, 10)}T${b.startTime}`);

  const upcoming = bookings.filter(
    (b) => parseDateTime(b) >= now && b.status === "booked"
  );
  const past = bookings.filter(
    (b) => parseDateTime(b) < now || b.status === "cancelled"
  );

  const cancelBooking = async (id) => {
    const confirm = window.confirm("Cancel this booking?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:8000/api/bookings/cancel/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to cancel");

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
      alert("Booking cancelled successfully.");
    } catch (err) {
      alert(err.message || "Cancel failed");
    }
  };

  const BookingCard = ({ booking }) => {
    const isCancelable = booking.status === "booked" && parseDateTime(booking) >= now;

    return (

  
      <div className="border rounded-lg p-4 shadow-md bg-white transition hover:shadow-lg flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-blue-700">
            {booking.venueId?.name || "Unknown Venue"}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">{booking.courtName}</span> |{" "}
            {booking.date?.slice(0, 10)} | {booking.startTime} – {booking.endTime}
          </p>
          <p
            className={`text-xs mt-2 font-medium ${
              booking.status === "cancelled" ? "text-red-500" : "text-green-600"
            }`}
          >
            Status: {booking.status?.toUpperCase()}
          </p>
        </div>

        {isCancelable && (
          <button
            onClick={() => cancelBooking(booking._id)}
            className="ml-4 text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancel
          </button>
        )}
      </div>


    
    );
  };

  if (loading) return <p className="text-center py-12 text-lg">Loading your bookings…</p>;

  return (
    <div className="relative min-h-screen bg-gray-100 px-4 py-6">
      {/* Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-[1003]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-2xl text-blue-700 hover:text-blue-900 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-10 bg-white rounded-xl shadow-lg mt-12">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">📅 My Bookings</h2>

        {/* Desktop Tabs */}
        <div className="hidden md:flex gap-6 mb-6">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              activeTab === "upcoming"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("previous")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              activeTab === "previous"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Previous
          </button>
        </div>

        {/* Mobile View – show both sections */}
        <div className="block md:hidden space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-4 text-green-700">Upcoming</h3>
            {upcoming.length === 0 ? (
              <p className="text-gray-500">No upcoming bookings.</p>
            ) : (
              <div className="space-y-4">
                {upcoming.map((b) => (
                  <BookingCard key={b._id} booking={b} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Previous</h3>
            {past.length === 0 ? (
              <p className="text-gray-500">No past or cancelled bookings.</p>
            ) : (
              <div className="space-y-4">
                {past.map((b) => (
                  <BookingCard key={b._id} booking={b} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Desktop View – toggled sections */}
        <div className="hidden md:block">
          {activeTab === "upcoming" && (
            <section>
              {upcoming.length === 0 ? (
                <p className="text-gray-500">No upcoming bookings.</p>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((b) => (
                    <BookingCard key={b._id} booking={b} />
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "previous" && (
            <section>
              {past.length === 0 ? (
                <p className="text-gray-500">No past or cancelled bookings.</p>
              ) : (
                <div className="space-y-4">
                  {past.map((b) => (
                    <BookingCard key={b._id} booking={b} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
    
  );
};

export default MyBookings;
