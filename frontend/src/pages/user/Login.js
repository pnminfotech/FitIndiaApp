import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgimage from "../../assets/backgroundlogin.png";

const BACKEND_URL = "https://api.getfitindia.in/api/auth"; // Base URL for backend

const Login = () => {
  const [mobile, setMobile] = useState("91"); // start with 91
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------- Send OTP or Verify OTP ----------------
  const handleOtpClick = async () => {
    if (!mobile || mobile.length !== 12) return alert("Enter a valid 10-digit mobile number after 91");

    setLoading(true);

    try {
      if (!otpSent) {
        // Send OTP
        const res = await fetch(`${BACKEND_URL}/otp/request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile }),
        });
        const data = await res.json();
        if (res.ok) {
          setOtpSent(true);
          alert("OTP sent successfully");
        } else {
          alert(data.error || "Failed to send OTP");
        }
      } else {
        // Verify OTP
        if (!otp) return alert("Enter OTP");
        const res = await fetch(`${BACKEND_URL}/otp/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile, otp }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role);
          navigate("/user/sportsvenue");
        } else {
          alert(data.error || "Invalid OTP");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105 mx-auto md:mx-0">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6 md:text-4xl">
          Welcome Back!
        </h2>

        {/* Mobile Input */}
        <input
          type="text"
          value={mobile}
          onChange={(e) => {
            let val = e.target.value.replace(/\D/g, ""); // only digits
            if (!val.startsWith("91")) val = "91" + val.replace(/^91/, "");
            if (val.length > 12) val = val.slice(0, 12); // max 12 digits
            setMobile(val);
          }}
          placeholder="Mobile Number"
          maxLength={12}
          className="w-full px-5 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />

        {/* OTP Input (shown after OTP is sent) */}
        {otpSent && (
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // only digits
            placeholder="Enter OTP"
            className="w-full px-5 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        )}

        {/* Button */}
        <button
          onClick={handleOtpClick}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg text-xl font-bold hover:bg-indigo-700 transition duration-300 transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          disabled={loading}
        >
          {loading ? "Processing..." : !otpSent ? "Send OTP" : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default Login;
