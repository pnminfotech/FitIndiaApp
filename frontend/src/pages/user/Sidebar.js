import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHome,
  FaPlus,
  FaClipboardList,
  FaTimes,
} from "react-icons/fa";

import profileimg from "../../assets/profile.png";

const Sidebar = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("https://api.getfitindia.in/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    onClose();
    navigate("/user/login");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-[1001]"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-[1002] text-black transition-transform rounded-tr-3xl rounded-br-3xl overflow-y-auto">
        {/* Profile Section */}
        <div className="flex flex-col items-center py-6 px-4 border-b border-gray-200 relative bg-gradient-to-br from-blue-50 to-white rounded-tr-3xl">
          <img
            src={profileimg}
            alt="profile"
            className="w-16 h-16 rounded-full mb-2 border-2 border-white shadow"
          />
          {user ? (
            <p className="text-sm font-medium">{user.name}</p>
          ) : (
            <p className="text-sm text-gray-500">Not logged in</p>
          )}
          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-red-500 absolute top-3 right-3"
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu List */}
        <ul className="p-4 space-y-3">
          <li
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-500 shadow-sm cursor-pointer hover:bg-gray-100 transition"
            onClick={() => {
              onClose();
              navigate("/user/homepage");
            }}
          >
            <FaHome className="text-gray-500" /> Homepage
          </li>

          <li
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-500 shadow-sm cursor-pointer hover:bg-gray-100 transition"
            onClick={() => {
              onClose();
              navigate("/user/profile");
            }}
          >
            <FaUser className="text-gray-500" /> Profile
          </li>

          <li
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-500 shadow-sm cursor-pointer hover:bg-gray-100 transition"
            onClick={() => {
              onClose();
              navigate("/user/sportsvenue");
            }}
          >
            <FaPlus className="text-gray-500" /> Venues
          </li>

          <li
            className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-500 shadow-sm cursor-pointer hover:bg-gray-100 transition"
            onClick={() => {
              onClose();
              navigate("/user/mybookings");
            }}
          >
            <FaClipboardList className="text-gray-500" /> My Bookings
          </li>

          {!user && (
            <li
              className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg shadow-sm cursor-pointer hover:bg-green-100 transition"
              onClick={() => {
                onClose();
                navigate("/user/login");
              }}
            >
              <FaUser /> Log In
            </li>
          )}
        </ul>

        {/* Logout Button */}
        {user && (
          <div className="px-4 py-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
            >
              <FaTimes /> Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
