import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import moment from "moment";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const [isConfirming, setIsConfirming] = useState(false);

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold">No booking found</h2>
          <p className="mt-2 text-sm text-gray-600">Go back and start a booking.</p>
        </div>
      </div>
    );
  }

  const { selectedSlots, selectedDate, selectedCourt, sports, venue } =
    bookingData;
  const totalPrice = bookingData.totalPrice || 0;

  // safe retrieval of Razorpay key (CRA friendly)
  const RAZORPAY_KEY = (() => {
    try {
      // CRA: REACT_APP_RAZORPAY_KEY_ID
      if (process.env.REACT_APP_RAZORPAY_KEY_ID) return process.env.REACT_APP_RAZORPAY_KEY_ID;
      // fallback: you can set window.__RAZORPAY_KEY in index.html if you prefer
      if (window.__RAZORPAY_KEY) return window.__RAZORPAY_KEY;
      return "";
    } catch (e) {
      return "";
    }
  })();

  // Load Razorpay SDK
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated (no token). Please login.");
      }

      // 1) Create booking on backend (your backend returns bookings + razorpayOrder)
      const bookingRes = await fetch("https://api.getfitindia.in/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          venueId: venue._id,
          courtId: selectedCourt._id,
          courtName: selectedCourt.courtName,
          date: selectedDate,
          selectedSlots,
        }),
      });

      console.log("Booking API status:", bookingRes.status);
      const data = await bookingRes.json();
      console.log("Booking API response:", data);

      if (!bookingRes.ok) {
        // backend returned non-2xx
        throw new Error(data?.message || "Booking creation failed on server");
      }

      // data shape expected: { bookings: [...], razorpayOrder: {...}, amount: number }
      const bookingId =
        data?.bookings?.[0]?._id ||
        data?.bookings?.[0]?.id ||
        data?.bookings?._id ||
        null;

      const orderData =
        data?.razorpayOrder || data?.order || data?.razorpay_order || null;

      const orderId = orderData?.id || orderData?.order_id || null;

      if (!bookingId) {
        throw new Error("Booking ID not found in response (backend shape changed).");
      }
      if (!orderData || !orderId) {
        throw new Error("Razorpay order data not found in booking response.");
      }

      // 2) Load Razorpay SDK
      const sdkLoaded = await loadRazorpay();
      console.log("Razorpay SDK loaded:", sdkLoaded);
      if (!sdkLoaded) {
        throw new Error("Failed to load Razorpay SDK. Check network or blocker.");
      }

      // 3) ensure we have a key
      if (!RAZORPAY_KEY) {
        // explicit, helpful error
        throw new Error(
          "Razorpay key is missing. Add REACT_APP_RAZORPAY_KEY_ID to your frontend .env and restart dev server."
        );
      }

      // 4) Configure Razorpay checkout
      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount, // amount in paise (backend returns paise)
        currency: orderData.currency || "INR",
        name: venue?.name || "Venue Booking",
        description: `Booking at ${venue?.name || ""}`,
        order_id: orderId,
       handler: async function (response) {
  console.log("Razorpay success response:", response);

  try {
    const verifyRes = await fetch(
      "https://api.getfitindia.in/api/payments/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          bookingIds: data.bookings.map((b) => b._id), // ✅ fixed here
        }),
      }
    );

    console.log("Verify API status:", verifyRes.status);
    const verifyData = await verifyRes.json();
    console.log("Verify API response:", verifyData);

    if (verifyRes.ok) {
      navigate("/user/payment-success", {
        state: { bookingData: { ...bookingData, bookingId } },
      });
    } else {
      alert(
        "Payment verification failed: " +
          (verifyData?.error || verifyData?.message || "Unknown")
      );
    }
  } catch (verifyErr) {
    console.error("Payment verification error:", verifyErr);
    alert("Payment verification failed. Check console for details.");
  }
},

        prefill: {
          name: localStorage.getItem("username") || "",
          email: localStorage.getItem("email") || "",
          contact: localStorage.getItem("phone") || "",
        },
        theme: { color: "#f97316" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response);
        alert("Payment failed. See console for details.");
      });

      rzp.open();
    } catch (err) {
      console.error("Error in handleConfirm:", err);
      alert("Something went wrong: " + (err.message || err));
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Booking summary (kept minimal here — you can paste your full UI) */}
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Confirm & Pay</h2>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Venue</p>
              <p className="font-semibold">{venue?.name}</p>
              <p className="text-sm text-gray-600">{venue?.address}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{moment(selectedDate).format("dddd, MMMM Do YYYY")}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Slots</p>
            <div className="flex gap-2 flex-wrap mt-2">
              {selectedSlots.map((s) => (
                <span key={s._id || `${s.startTime}-${s.endTime}`} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {moment(s.startTime, "HH:mm").format("h:mm A")} - {moment(s.endTime, "HH:mm").format("h:mm A")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-md z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">Total Payable</div>
            <div className="text-2xl font-extrabold text-orange-600">₹{totalPrice}</div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isConfirming ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-orange-600 text-white hover:bg-orange-700"
            }`}
          >
            {isConfirming ? "Processing..." : "Confirm & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
