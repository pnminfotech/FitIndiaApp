import React, { useState } from "react";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaClipboardList, FaUserTie } from "react-icons/fa";
import { MdSchedule, MdDashboard } from "react-icons/md";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

import logo from "../assets/logo.png";

import {  NavLink, Outlet } from "react-router-dom";
// import Header from '../components/Header.js'

const AdminLayout = () => {
  
  const [isCollapse, setIsCollapse] = useState(false);

  return (
    <>
      {/* <Header/> */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 font-bold  bg-gray-700 text-white">
          <div className="text-2xl font-bold text-center py-4 border-b border-black-600 flex justify-between items-center px-4">
            Admin
            <button
              onClick={() => setIsCollapse(!isCollapse)}
              className="md:block hidden text-white text-sm"
            >
              {isCollapse ? (
                <MdExpandMore size={30} />
              ) : (
                <MdExpandLess size={30} />
              )}
            </button>
          </div>
          <nav className="p-4 flex md:flex-col flex-wrap justify-around md:justify-start gap-2">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200
    ${
      isActive ? "bg-gray-400 text-black" : "hover:bg-gray-300 hover:text-black"
    }`
              }
            >
              <MdDashboard size={30} />
              Dashboard
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200
    ${
      isActive ? "bg-gray-400 text-black" : "hover:bg-gray-300 hover:text-black"
    }`
              }
              to="/admin/venues"
              end
            >
              <span>
                <HiOutlineBuildingOffice2 size={30} />
              </span>
              Venues
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200
    ${
      isActive ? "bg-gray-400 text-black" : "hover:bg-gray-300 hover:text-black"
    }`
              }
              to="/admin/venues/add"
            >
              <span>
                <AiOutlinePlusCircle size={30} />
              </span>
              Add Venue
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200
    ${
      isActive ? "bg-gray-400 text-black" : "hover:bg-gray-300 hover:text-black"
    }`
              }
              to="/admin/coaches"
            >
              <span>
                <FaUserTie size={30} />
              </span>
              Coaches
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200
    ${
      isActive ? "bg-gray-400 text-black" : "hover:bg-gray-300 hover:text-black"
    }`
              }
              to="/admin/bookings"
            >
              <span>
                <FaClipboardList size={30} />
              </span>
              Bookings
            </NavLink>
            <NavLink
              to="/admin/manage"
              className={({ isActive }) =>
                `text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200
     ${
      isActive ? "bg-gray-400 text-black" : "hover:bg-gray-300 hover:text-black"
    }`
              }
            >
              <MdSchedule size={30} /> Manage Slots
            </NavLink>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 bg-gray-200">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
