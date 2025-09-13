import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import maleImg from "../../assets/man_13385962.png";
import femaleImg from "../../assets/woman_13330662.png";
import otherImg from "../../assets/profile.png";
import { User, MapPin, Calendar, Globe, Dribbble, Save } from 'lucide-react';

const UserProfile = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sportsPreferences, setSportsPreferences] = useState([]);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://api.getfitindia.in/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setName(data.name || "");
        setCity(data.city || "");
        setGender(data.gender || "");
        setMobile(data.mobile || "");
        setDateOfBirth(data.dateOfBirth?.split("T")[0] || "");
        setSportsPreferences(data.sportsPreferences || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://api.getfitindia.in/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          city,
          gender,
          dateOfBirth,
          sportsPreferences,
          mobile,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      setShowUpdateMessage(true);
      setTimeout(() => setShowUpdateMessage(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await fetch("https://api.getfitindia.in/api/users/location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ latitude, longitude }),
          });
          setCoords({ latitude, longitude });
          alert("Location updated!");
        } catch (err) {
          console.error("Failed to update location:", err);
        }
      },
      (err) => {
        alert("Location access denied.");
      }
    );
  };

  const getGenderImage = () => {
    if (gender === "Male") return maleImg;
    if (gender === "Female") return femaleImg;
    return otherImg;
  };

  const toggleSport = (sport) => {
    if (sportsPreferences.includes(sport)) {
      setSportsPreferences(sportsPreferences.filter((s) => s !== sport));
    } else {
      setSportsPreferences([...sportsPreferences, sport]);
    }
  };

  const sportOptions = ["Cricket", "Football", "Badminton", "Tennis", "Basketball"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6 font-sans">
      <div className="fixed top-4 left-4 z-[1003]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-2xl text-orange-600 hover:text-blue-900 transition duration-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaBars />
        </button>
      </div>

      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 md:p-10 max-w-7xl mx-auto mt-12 border border-blue-100 animate-fade-in-up">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center text-blue-800 tracking-tight">
          Your Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 bg-blue-50 rounded-2xl shadow-inner border border-blue-200">
            <img
              src={getGenderImage()}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-600 shadow-md"
            />
            <p className="mt-4 text-2xl text-gray-800 font-bold capitalize">{name || "User"}</p>
            <p className="text-md text-gray-600">
              <Globe size={16} className="inline-block mr-1 text-blue-500" /> {city || "Not set"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {gender || "N/A"}
              </span>
            </p>
            {coords && (
              <p className="mt-2 text-xs text-orange-600">
                📍 Lat: {coords.latitude.toFixed(4)} | Lng: {coords.longitude.toFixed(4)}
              </p>
            )}
            <button
              onClick={updateLocation}
              className="mt-4 text-sm text-blue-600 underline hover:text-blue-800"
            >
              📍 Update My Location
            </button>
          </div>

          <div className="md:col-span-2 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Your City"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile</label>
                  <input
                    type="tel"
                    maxLength="12"
                    pattern="[0-9]{10}"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="12-digit Mobile Number"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Sports Preferences</label>
                <div className="flex flex-wrap gap-3">
                  {sportOptions.map((sport) => (
                    <label
                      key={sport}
                      className={`px-4 py-2 rounded-full cursor-pointer font-medium transition ${
                        sportsPreferences.includes(sport)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={sportsPreferences.includes(sport)}
                        onChange={() => toggleSport(sport)}
                        className="hidden"
                      />
                      {sport}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
              >
                <Save size={20} className="inline-block mr-2" />
                Save Profile
              </button>
            </form>
          </div>
        </div>
      </div>

      {showUpdateMessage && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          Profile updated successfully! 🎉
        </div>
      )}
    </div>
  );
};

export default UserProfile;
