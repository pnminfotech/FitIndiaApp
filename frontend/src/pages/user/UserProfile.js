import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [sportsPreferences, setSportsPreferences] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const res = await fetch("http://localhost:8000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          city,
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

  const handlePreferencesChange = (e) => {
    const value = e.target.value;
    const list = value.split(",").map((item) => item.trim());
    setSportsPreferences(list);
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">User Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">City</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Sports Preferences</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={sportsPreferences.join(", ")}
            onChange={handlePreferencesChange}
            placeholder="e.g. Cricket, Football, Badminton"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
