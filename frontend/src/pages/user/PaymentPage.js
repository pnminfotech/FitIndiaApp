import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle, XCircle, Info, ArrowLeft, Building, CalendarDays, Clock, Dribbble, Wallet, ExternalLink } from "lucide-react"; // Added ExternalLink
import moment from "moment"; // For date formatting

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;

  // Placeholder for QR code image (replace with actual path or dynamic generation)
  // For a classy look, consider a QR code that's not overly colorful or cartoonish.
  // A simple black-on-white QR code is best.
  const qrCodePlaceholder = "https://via.placeholder.com/220x220?text=Payment+QR"; // Slightly larger, professional placeholder

  const [isConfirming, setIsConfirming] = useState(false);

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 font-sans">
        <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg w-full border border-gray-200 animate-fade-in">
          <XCircle size={60} className="text-red-500 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No Booking Details Found</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            It appears there are no active booking details to process a payment. Please navigate back and initiate a booking.
          </p>
          <button
            onClick={() => navigate("/user/venues")}
            className="inline-flex items-center justify-center px-8 py-4 bg-orange-700 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-orange-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-75"
          >
            <ArrowLeft size={22} className="mr-3" /> Explore Venues
          </button>
        </div>
      </div>
    );
  }

const { selectedSlots, selectedDate, selectedCourt, sports, venue } = bookingData;
const totalPrice = bookingData.totalPrice || 0; // fallback in case totalPrice is missing


  const handleConfirm = async () => {
  setIsConfirming(true);
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("https://api.getfitindia.in/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        venueId: bookingData.venue._id,
        courtId: bookingData.selectedCourt._id,
        courtName: bookingData.selectedCourt.courtName,
        date: bookingData.selectedDate,
        selectedSlots: bookingData.selectedSlots, // ✅ fixed here
      }),
    });

    if (!response.ok) {
      throw new Error("Booking failed. Slot might be unavailable.");
    }

    const booked = await response.json();

    navigate("/user/payment-success", {
      state: { bookingData: { ...bookingData, bookedId: booked._id } },
    });
  } catch (error) {
    console.error("Booking failed:", error);
    alert("Booking failed. Please try again.");
  } finally {
    setIsConfirming(false);
  }
};



  return (
 <div className="min-h-screen bg-white mt-20 md:mt-0 md:pt-20 pb-32 px-4 sm:px-6 lg:px-8 font-sans">



      {/* Header with Venue Name and Back Button */}
     <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200 px-4 py-3 sm:px-8 flex items-center justify-between">
  {/* Left: Back Button */}
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 px-3 py-1 rounded-full bg-white text-orange-600 hover:bg-orange-100 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
   
  </button>

  {/* Center: Venue Name */}
  <h1 className="text-lg sm:text-2xl font-extrabold text-gray-800 text-center flex-grow mx-4">
   confirm & Pay
  </h1>

  
</div>

     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
  {/* Payment QR Code Section - Left Panel */}
  <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 animate-fade-in-up">
    <h2 className="text-sm sm:text-sm font-bold text-gray-800 mb-6 flex items-center gap-3 sm:gap-4">
      <CreditCard size={18} className="text-orange-600 opacity-90" /> Payment Details
    </h2>
    <p className="text-sm sm:text-sm text-gray-600 mb-6 leading-relaxed">
      Scan the QR code below using your preferred UPI application to complete the transaction.
    </p>

    <div className="flex justify-center mb-6">
      <div className="relative inline-block border border-gray-200 rounded-lg p-3 shadow-inner bg-white">
        <img
          src={qrCodePlaceholder}
          alt="QR Code for UPI Payment"
          className="w-48 sm:w-56 h-48 sm:h-56 object-contain rounded-md"
        />
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-sm text-gray-500 text-xs px-2 py-1 rounded">UPI</span>
      </div>
    </div>

    {/* <div className="flex items-center justify-between bg-orange-50 p-3 rounded-lg border border-orange-100 shadow-sm mb-6">
      <p className="text-lg sm:text-xl font-bold text-orange-600 flex items-center gap-2">
        <Wallet size={22} className="text-orange-600" /> Total Amount:
      </p>
      <p className="text-2xl sm:text-3xl font-extrabold text-orange-600">
        ₹{totalPrice}
      </p>
    </div> */}

    <p className="text-sm text-gray-500 flex items-start gap-2 leading-tight">
      <Info size={18} className="text-orange-400 opacity-80 flex-shrink-0 mt-1" />
      <span>
        Ensure the payment is made from the mobile number registered with your account for seamless verification.
      </span>
    </p>
    <p className="text-sm text-gray-500 mt-2 flex items-center gap-2 leading-tight">
      <ExternalLink size={18} className="text-gray-400 opacity-80 flex-shrink-0" />
      <a
        href="https://www.npci.org.in/what-we-do/upi/product-overview"
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-500 hover:underline"
      >
        Learn more about UPI payments.
      </a>
    </p>
  </div>

  {/* Booking Summary Section - Right Panel */}
  <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 animate-fade-in-up delay-100">
    <h3 className="text-md sm:text-md font-bold text-gray-800 mb-6 flex items-center gap-3 sm:gap-4">
      <CheckCircle size={18} className="text-orange-600 opacity-90" /> Booking Overview
    </h3>
    <div className="space-y-5 text-gray-700">
      <div className="flex items-start sm:items-center">
        <Building size={22} className="text-orange-600 mr-4 flex-shrink-0 mt-1 sm:mt-0" />
        <div>
          <p className="text-sm text-gray-500">Venue</p>
          <p className="text-sm font-semibold">{venue.name}</p>
          <p className="text-sm text-gray-600">{venue.address}</p>
        </div>
      </div>

      <div className="flex items-start sm:items-center">
        <CalendarDays size={22} className="text-orange-600 mr-4 flex-shrink-0 mt-1 sm:mt-0" />
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="text-sm font-semibold">{moment(selectedDate).format("dddd, MMMM Do YYYY")}</p>
        </div>
      </div>

      <div className="flex items-start sm:items-center">
        <Clock size={22} className="text-orange-600 mr-4 flex-shrink-0 mt-1 sm:mt-0" />
        <div>
          <p className="text-sm text-gray-500">Time Slot(s)</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {selectedSlots.map((slot) => (
              <span
                key={slot._id || `${slot.startTime}-${slot.endTime}`}
                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full font-medium border border-gray-200"
              >
                {moment(slot.startTime, "HH:mm").format("h:mm A")} - {moment(slot.endTime, "HH:mm").format("h:mm A")}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-start sm:items-center">
        <Dribbble size={22} className="text-orange-600 mr-4 flex-shrink-0 mt-1 sm:mt-0" />
        <div>
          <p className="text-sm text-gray-500">Sport</p>
          <p className="text-sm font-semibold capitalize">{sports}</p>
        </div>
      </div>

      <div className="flex items-start sm:items-center">
        <Building size={22} className="text-orange-600 mr-4 flex-shrink-0 mt-1 sm:mt-0" />
        <div>
          <p className="text-sm text-gray-500">Court</p>
          <p className="text-sm font-semibold">{selectedCourt.courtName}</p>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Fixed Bottom Bar for Confirm Payment Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 sm:p-6 border-t border-gray-200 shadow-2xl z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-col sm:flex-row gap-4">   
           <div className="flex items-baseline text-gray-700">
            <span className="text-sm font-medium mr-2">Total Payable:</span>
            <span className="text-2xl font-extrabold text-orange-600">₹{totalPrice}</span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform active:scale-98 focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              isConfirming
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500"
            }`}
          >
            {isConfirming ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                Verifying Payment...
              </>
            ) : (
              <>
                <CheckCircle size={24} /> Confirm Payment
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom Animations (add this to your main CSS file or index.css) */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

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
          animation: fadeInMoveUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-fade-in-up.delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;