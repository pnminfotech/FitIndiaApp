import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; // adjust path if needed
import { FaBars } from "react-icons/fa";
import maleImg from "../../assets/man_13385962.png";
import femaleImg from "../../assets/woman_13330662.png";
import otherImg from "../../assets/profile.png"; // optional

const UserProfile = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sportsPreferences, setSportsPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationUpdated, setLocationUpdated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
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

  if (loading) return <p className="text-center py-10">Loading...</p>;

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

    {/* Full Page Layout */}
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-7xl mx-auto mt-12">
      <h2 className="text-4xl font-bold mb-6 text-center text-blue-700">User Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Profile Image */}
   {/* Profile Image Box */}
<div className="flex flex-col items-center">
  <img
    src={getGenderImage()}
    alt="Profile"
    className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
  />
  <p className="mt-4 text-lg text-gray-700 font-semibold">{name}</p>
  <p className="text-sm text-gray-500">📱 {token ? 'Logged In' : 'No Token'}</p>
</div>


        {/* Right Side: Profile Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-500"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sports Preferences
              </label>
              <div className="flex flex-wrap gap-4">
                {sportOptions.map((sport) => (
                  <label key={sport} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={sportsPreferences.includes(sport)}
                      onChange={() => toggleSport(sport)}
                    />
                    <span>{sport}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

};

export default UserProfile;
