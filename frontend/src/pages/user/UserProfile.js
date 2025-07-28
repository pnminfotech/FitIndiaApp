import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; // adjust path if needed
import { FaBars } from "react-icons/fa";
import maleImg from "../../assets/man_13385962.png";
import femaleImg from "../../assets/woman_13330662.png";
import otherImg from "../../assets/profile.png"; // optional
import { User, MapPin, Calendar, Globe, Dribbble, Save } from 'lucide-react'; // Import Lucide icons

const UserProfile = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sportsPreferences, setSportsPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationUpdated, setLocationUpdated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false); // State for feedback message

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setName(data.name || "");
        setCity(data.city || "");
        setGender(data.gender || "");
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

  useEffect(() => {
    if (!locationUpdated) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await fetch("http://localhost:8000/api/users/location", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ latitude, longitude }),
            });
            setLocationUpdated(true);
          } catch (err) {
            console.error("Failed to update location:", err);
          }
        },
        (err) => {
          console.warn("Location error:", err.message);
        }
      );
    }
  }, [token, locationUpdated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/users/me", {
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
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      setShowUpdateMessage(true);
      setTimeout(() => setShowUpdateMessage(false), 3000); // Hide after 3 seconds
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again."); // Using alert for now, consider a toast for better UX
    }
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700">Loading user profile...</p>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-6 font-sans">
      {/* Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-[1003]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-2xl text-blue-700 hover:text-blue-900 transition duration-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Full Page Layout */}
      <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 md:p-10 max-w-7xl mx-auto mt-12 border border-blue-100 animate-fade-in-up">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center text-blue-800 tracking-tight">
          Your Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side: Profile Image */}
          <div className="flex flex-col items-center p-6 bg-blue-50 rounded-2xl shadow-inner border border-blue-200">
            <div className="relative mb-6">
              <img
                src={getGenderImage()}
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-5 border-blue-600 shadow-md transform transition-transform duration-300 hover:scale-105"
              />
              <span className="absolute bottom-2 right-2 bg-green-500 text-white rounded-full p-2 text-xs">
                {/* Online indicator or status */}
              </span>
            </div>
            <p className="mt-4 text-2xl text-gray-800 font-bold capitalize">
              {name || "User"}
            </p>
            <p className="text-md text-gray-600">
              <Globe size={16} className="inline-block mr-1 text-blue-500" /> {city || "Not set"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {gender || "N/A"}
              </span>
            </p>
          </div>

          {/* Right Side: Profile Form */}
          <div className="md:col-span-2 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <User size={18} className="text-indigo-500" /> Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition duration-200 text-gray-800 placeholder-gray-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <MapPin size={18} className="text-green-500" /> City
                  </label>
                  <input
                    id="city"
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 transition duration-200 text-gray-800 placeholder-gray-400"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Pimpri-Chinchwad"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <User size={18} className="text-purple-500" /> Gender
                  </label>
                  <select
                    id="gender"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition duration-200 text-gray-800"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="" disabled>Select your gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar size={18} className="text-orange-500" /> Date of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition duration-200 text-gray-800"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
              </div>

              {/* Sports Preferences */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Dribbble size={18} className="text-red-500" /> Sports Preferences
                </label>
                <div className="flex flex-wrap gap-3">
                  {sportOptions.map((sport) => (
                    <label
                      key={sport}
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ease-in-out
                        ${sportsPreferences.includes(sport)
                          ? "bg-blue-600 text-white shadow-md transform scale-105"
                          : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={sportsPreferences.includes(sport)}
                        onChange={() => toggleSport(sport)}
                        className="hidden" // Hide default checkbox
                      />
                      <span>{sport}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold text-lg transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform active:scale-98 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Save size={20} /> Save Profile
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Update Success Message */}
      {showUpdateMessage && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl animate-bounce-in z-50">
          Profile updated successfully! 🎉
        </div>
      )}

      {/* Custom Animations (add to your main CSS or index.css) */}
      <style jsx>{`
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
          animation: fadeInMoveUp 0.6s ease-out forwards;
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;