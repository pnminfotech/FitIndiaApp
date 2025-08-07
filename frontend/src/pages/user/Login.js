import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgimage from "../../assets/backgroundlogin.png";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password || (isRegister && !name)) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    const url = isRegister
      ? "https://api.getfitindia.in/api/auth/register"
      : "https://api.getfitindia.in/api/auth/login";

    const body = isRegister
      ? { name, email, password, role: "user" }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (isRegister) {
          alert("Registered successfully. Please login.");
          setIsRegister(false);
          setPassword("");
        } else {
          if (data.user.role !== "user") {
            alert("Unauthorized role.");
            return;
          }
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role);
          navigate("/user/homepage");
        }
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Login/Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgimage})` }}
    >
      {/* Overlay for better readability of content over image */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105 mx-auto md:mx-0">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6 md:text-4xl">
          {isRegister ? "Create Your Account" : "Welcome Back!"}
        </h2>

        {/* Toggle Tab */}
        <div className="flex justify-between mb-6 bg-gray-100 rounded-lg p-1">
          <button
            className={`w-1/2 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
              !isRegister
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
              isRegister
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setIsRegister(true)}
          >
            Register
          </button>
        </div>

        {isRegister && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-5 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
          />
        )}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full px-5 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-5 py-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg text-xl font-bold hover:bg-indigo-700 transition duration-300 transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          disabled={loading}
        >
          {loading ? "Processing..." : isRegister ? "Register" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;