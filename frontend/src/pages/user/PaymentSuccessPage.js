import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Corrected imports: Ensure XCircle is present, remove unused CalendarDays and Dribbble
import { CheckCircle, Home, Building, Clock, IndianRupee, XCircle } from "lucide-react";
import moment from "moment"; // For date formatting

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const [showConfetti, setShowConfetti] = useState(false); // State for a subtle animation

  useEffect(() => {
    // Optionally trigger a subtle success animation (like a quick bounce or fade-in)
    // For a more advanced confetti effect, you might use a library like react-confetti.
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000); // Hide after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  // Handle cases where bookingData might be missing (e.g., direct navigation)
  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 font-sans">
        <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg w-full border border-gray-200 animate-fade-in">
          {/* XCircle is now correctly imported and used here */}
          <XCircle size={60} className="text-red-500 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Booking Details Not Found</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            It seems there was an issue retrieving your booking information. Please check your email or bookings section.
          </p>
          <button
            onClick={() => navigate("/user/bookings")} // Assuming you have a user bookings page
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-75"
          >
            <Home size={22} className="mr-3" /> Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const { venue, selectedDate, selectedCourt, selectedSlots, totalPrice, sports } = bookingData;

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center items-center px-4 py-6 sm:py-10 font-sans">
    {/* Confetti */}
    {showConfetti && (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 70%)`,
            }}
          ></div>
        ))}
      </div>
    )}

    <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 max-w-xl w-full text-center border border-green-100 animate-fade-in-up">
      <CheckCircle size={70} className="text-green-500 mx-auto mb-5 drop-shadow-md" />
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-3 tracking-tight leading-snug">
        Payment Successful!
      </h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
        Your booking for <strong>{venue?.name}</strong> has been confirmed.
        A confirmation has been sent to your registered email.
      </p>

      <div className="bg-gray-50 rounded-xl p-5 sm:p-6 mb-6 border border-gray-100 text-left shadow-inner">
        <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-4 border-b pb-3 border-gray-200 flex items-center gap-3">
          <Building size={22} className="text-blue-500" /> Booking Details
        </h3>
        <div className="space-y-3 text-sm sm:text-base text-gray-700">
          <p className="flex">
            <span className="font-semibold w-24 sm:w-28">Venue:</span> <span>{venue?.name}</span>
          </p>
          <p className="flex">
            <span className="font-semibold w-24 sm:w-28">Court:</span> <span>{selectedCourt?.courtName}</span>
          </p>
          <p className="flex">
            <span className="font-semibold w-24 sm:w-28">Date:</span>
            <span>{moment(selectedDate).format("dddd, MMMM Do YYYY")}</span>
          </p>
          <p className="flex">
            <span className="font-semibold w-24 sm:w-28">Sport:</span> <span className="capitalize">{sports}</span>
          </p>
          <p className="flex items-start">
            <span className="font-semibold w-24 sm:w-28">Time Slot(s):</span>
            <span className="flex flex-wrap gap-2">
              {selectedSlots?.map((slot) => (
                <span
                  key={slot._id || `${slot.startTime}-${slot.endTime}`}
                  className="bg-blue-100 text-blue-800 text-xs sm:text-sm px-2 py-1 rounded-full font-medium"
                >
                  {moment(slot.startTime, "HH:mm").format("h:mm A")} -{" "}
                  {moment(slot.endTime, "HH:mm").format("h:mm A")}
                </span>
              ))}
            </span>
          </p>
          <p className="flex items-center text-lg font-bold text-gray-900 pt-4 border-t border-gray-200">
            <IndianRupee size={20} className="mr-2 text-green-600" />
            <span className="w-28 flex-shrink-0">Amount Paid:</span>
            <span className="text-green-600">₹{totalPrice}</span>
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
        <button
          onClick={() => navigate("/")}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-blue-700 text-white font-semibold text-base rounded-lg shadow-md hover:bg-blue-800 transition-all duration-300"
        >
          <Home size={20} className="mr-2" /> Home
        </button>
        <button
          onClick={() => navigate("/user/mybookings")}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-800 font-semibold text-base rounded-lg shadow hover:bg-gray-100 transition-all duration-300"
        >
          <Clock size={20} className="mr-2" /> My Bookings
        </button>
      </div>
    </div>

    {/* CSS for animations and confetti */}
    <style jsx>{`
      @keyframes fadeInMoveUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in-up {
        animation: fadeInMoveUp 0.6s ease-out forwards;
      }

      @keyframes fall {
        from {
          transform: translateY(-100px) rotateZ(0deg);
          opacity: 0;
        }
        to {
          transform: translateY(100vh) rotateZ(720deg);
          opacity: 1;
        }
      }

      .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        opacity: 0;
        animation: fall 3s ease-in-out forwards;
        animation-iteration-count: 1;
      }
    `}</style>
  </div>
);

};

export default PaymentSuccessPage;