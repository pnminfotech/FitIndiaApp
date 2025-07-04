import React from "react";
import { MdDashboard } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaUserTie } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import logo from "../assets/logo.png";

import { Link, NavLink, Outlet } from "react-router-dom";
// import Header from '../components/Header.js'

const AdminLayout = () => {
  return (
    <>
      {/* <Header/> */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 font-bold  bg-gray-700 text-white">
          <div className="text-2xl font-bold text-center py-4 border-b border-black-600">
            Admin
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

            <Link
              className="hover:bg-gray-300 hover:text-black text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200"
              to="/admin/venues"
            >
              <span>
                <HiOutlineBuildingOffice2 size={30} />
              </span>
              Venues
            </Link>
            <Link
              className="hover:bg-gray-300 hover:text-black text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200"
              to="/admin/venues/add"
            >
              <span>
                <AiOutlinePlusCircle size={30} />
              </span>
              Add Venue
            </Link>
            <Link
              className="hover:bg-gray-300 hover:text-black text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200"
              to="/admin/coaches"
            >
              <span>
                <FaUserTie size={30} />
              </span>
              Coaches
            </Link>
            <Link
              className="hover:bg-gray-300 hover:text-black text-sm md:text-xl p-5 rounded-lg flex items-center gap-3 transition-all duration-200"
              to="/admin/bookings"
            >
              <span>
                <FaClipboardList size={30} />
              </span>
              Bookings
            </Link>
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
