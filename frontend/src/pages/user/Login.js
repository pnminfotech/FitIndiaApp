import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const roles = ["User", "Coach", "Admin"];

const Login = () => {
  const [role, setRole] = useState("User");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
const navigate = useNavigate(); 
  const sendOtp = async () => {
    if (role !== "User") {
      alert("Only 'User' role is allowed to log in currently.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
      } else {
        alert(data.error || "Failed to send OTP");
      }
    } catch (err) {
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (role !== "User") {
      alert("Only 'User' role is allowed to log in currently.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile,
          otp,
          role: role.toLowerCase(), // this will be "user"
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role.toLowerCase());
        alert(`${role} login successful`);
       // With this:
navigate("/user/homepage");
      } else {
        alert(data.error || "OTP verification failed");
      }
    } catch (err) {
      alert("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Login as {role}</h2>

        {/* Role Selector */}
        <div className="flex justify-between mb-4">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 mx-1 rounded ${
                role === r ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Mobile Input */}
        <input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter mobile number"
          className="w-full border px-3 py-2 rounded mb-3"
        />

        {/* OTP Input */}
        {otpSent && (
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border px-3 py-2 rounded mb-3"
          />
        )}

        {/* Action Button */}
        <button
          onClick={otpSent ? verifyOtp : sendOtp}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default Login;
