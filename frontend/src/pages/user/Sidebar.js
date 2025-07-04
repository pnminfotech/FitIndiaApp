import React from "react";
import { MdDashboard } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaUserTie } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import profileimg from "../../assets/profile.png";

const Sidebar = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2f3e55] text-white shadow-md flex flex-col">
        {/* Header */}
        <div className="text-2xl font-bold text-center py-6 border-b border-gray-500">
          <div className="flex flex-col items-center justify-center">
            <img src={profileimg} alt="profile" className="w-24" />
            
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col py-4 px-2 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all ${
                isActive
                  ? "bg-white text-[#2f3e55]"
                  : "hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <MdDashboard size={22} className="mr-3" />
            Profile
          </NavLink>

          <NavLink
            to="/admin/venues"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all ${
                isActive
                  ? "bg-white text-[#2f3e55]"
                  : "hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <HiOutlineBuildingOffice2 size={22} className="mr-3" />
            Venues
          </NavLink>

          <NavLink
            to="/admin/venues/add"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all ${
                isActive
                  ? "bg-white text-[#2f3e55]"
                  : "hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <AiOutlinePlusCircle size={22} className="mr-3" />
            Add Venue
          </NavLink>

          <NavLink
            to="/admin/coaches"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all ${
                isActive
                  ? "bg-white text-[#2f3e55]"
                  : "hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <FaUserTie size={22} className="mr-3" />
            Coaches
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all ${
                isActive
                  ? "bg-white text-[#2f3e55]"
                  : "hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <FaClipboardList size={22} className="mr-3" />
            Bookings
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default Sidebar;
