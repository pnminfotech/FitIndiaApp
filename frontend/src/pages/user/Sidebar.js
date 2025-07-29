import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHome,
  FaPlus,
  FaChalkboardTeacher,
  FaClipboardList,
  FaTimes,
} from "react-icons/fa";

import profileimg from "../../assets/profile.png";
import MyBookings from "./MyBookings";

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

      const res = await fetch("http://localhost:8000/api/users/me", {
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

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-[1001]"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="fixed top-0 left-0 h-full w-64 bg-[#1E293B] shadow-lg z-[1002] text-white transition-transform">
        <div className="flex flex-col items-center border-b border-gray-700 pb-6 pt-6 px-4 relative">
          <img
            src={profileimg}
            alt="profile"
            className="w-16 h-16 rounded-full mb-2 border-2 border-white"
          />
          {user ? (
            <p className="text-sm text-gray-200">📱 {user.name}</p>
          ) : (
            <p className="text-sm text-gray-400">Loading...</p>
          )}
          <button
            onClick={onClose}
            className="text-xl hover:text-red-500 absolute top-2 right-2"
          >
            <FaTimes />
          </button>
        </div>

       <ul className="p-4 space-y-4">
  <li
    className="flex items-center gap-3 hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
    onClick={() => {
      onClose();
      navigate("/user/homepage");
    }}
  >
    <FaHome /> Homepage
  </li>

  <li
    className="flex items-center gap-3 hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
    onClick={() => {
      onClose();
      navigate("/user/profile");
    }}
  >
    <FaUser /> Profile
  </li>

  <li
    className="flex items-center gap-3 hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
    onClick={() => {
      onClose();
      navigate("/user/sportsvenue");
    }}
  >
    <FaPlus /> Venues
  </li>

  <li
    className="flex items-center gap-3 hover:bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
    onClick={() => {
      onClose();
      navigate("/user/mybookings");
    }}
  >
    <FaClipboardList /> My Bookings
  </li>
</ul>

      </div>
    </>
  );
};

export default Sidebar;
