import React, { useState } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaClipboardList, FaUserTie, FaBars,FaUsers } from "react-icons/fa";
import { MdSchedule, MdDashboard } from "react-icons/md";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { NavLink, Outlet } from "react-router-dom";
import logo from "../assets/logo.png";

const AdminLayout = () => {
  const [isCollapse, setIsCollapse] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Toggle */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 bg-white p-2 rounded shadow-md"
        >
          <FaBars size={24} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside
          className={`
            font-bold bg-gray-700 text-white z-40
            ${sidebarOpen ? "block fixed top-0 left-0 h-full w-64" : "hidden"}
            md:block md:relative md:w-64
          `}
        >
          {/* Sidebar Header */}
          <div className="text-2xl font-bold text-center py-4 border-b border-black-600 flex justify-between items-center px-4">
            <h5 className="mx-auto">Admin</h5>
           
            <button
              className="md:hidden text-white"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Sidebar Nav */}
          <nav className="p-4 flex md:flex-col flex-wrap justify-around md:justify-start gap-2">
            <NavItem to="/admin/dashboard" icon={<MdDashboard size={30} />} label="Dashboard" />
            <NavItem to="/admin/venues" icon={<HiOutlineBuildingOffice2 size={30} />} label="Venues" />
            <NavItem to="/admin/venues/add" icon={<AiOutlinePlusCircle size={30} />} label="Add Venue" />
            <NavItem to="/admin/coaches" icon={<FaUserTie size={30} />} label="Coaches" />
            <NavItem to="/admin/bookings" icon={<FaUsers size={30} />} label="Users" />
            <NavItem to="/admin/allbookings" icon={<FaClipboardList size={30} />} label="Bookings" />
            <NavItem to="/admin/manage" icon={<MdSchedule size={30} />} label="Manage Slots" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 bg-gray-200 min-h-screen">
          <Outlet />
        </main>
      </div>
    </>
  );
};

// Reusable NavItem component
const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200
      ${isActive ? "bg-gray-400 text-black" : "hover:bg-gray-300 hover:text-black"}`
    }
  >
    <span>{icon}</span>
    {label}
  </NavLink>
);

export default AdminLayout;
