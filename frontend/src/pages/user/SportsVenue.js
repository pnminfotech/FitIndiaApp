// SportsVenue.js
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SportsGardenCard from "../../components/SportsGardenCard";
import DateButtonWithPicker from "../../components/DateButtonWithPicker";
import SportsDropdown from "../../components/SportsDropdown";
import Sidebar from "./Sidebar";
import { FaChevronDown, FaFilter } from "react-icons/fa";

function SportsVenue() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [dateText, setDateText] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/venues");
      const data = await res.json();
      setVenues(data);
      setFilteredVenues(data);
    } catch (err) {
      console.error("Error fetching venues:", err);
    } finally {
      setLoading(false);
    }
  };

  const uniqueCities = [...new Set(venues.map((v) => v.city).filter(Boolean))];

  const handleCityChange = (city) => {
    setSelectedCity(city);
    if (city === "All Cities") {
      setFilteredVenues(venues);
    } else {
      const filtered = venues.filter((v) => v.city === city);
      setFilteredVenues(filtered);
    }
  };

  return (
    <main className="relative">
      {/* Header */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={handleCityChange}
        uniqueCities={uniqueCities}
        onToggleSidebar={() => setShowSidebar(true)}
      />

      {/* Conditionally show Sidebar */}
      {showSidebar && <Sidebar onClose={() => setShowSidebar(false)} />}

      {/* Filters Section */}
      <section className="pt-12 px-[13px] sm:px-[100px]">
        <div className="flex justify-between items-center">
          <h1 className="text-xs font-bold">
            AVAILABLE VENUES <span className="text-gray-500">({filteredVenues.length})</span>
          </h1>
          <button className="text-blue-500 font-semibold text-lg border-none flex items-center gap-2">
            <FaFilter />
            FILTER
          </button>
        </div>

        <div className="flex items-center gap-6 pt-6 flex-wrap">
          <DateButtonWithPicker
            onDateChange={(date) => {
              const formatted = date.toLocaleDateString("default", {
                month: "long",
                weekday: "short",
                day: "numeric",
              });
              setDateText(formatted);
            }}
          />
          {dateText && <p className="text-sm text-gray-600">Selected Date: {dateText}</p>}
          <hr className="h-[40px] border-l border-gray-300" />

          <button className="px-4 py-2 text-blue-500 border border-gray-300 rounded-full flex items-center text-sm font-medium">
            Amenities <FaChevronDown className="ml-1" />
          </button>

          <SportsDropdown />

          <button className="px-4 py-2 text-blue-500 border border-gray-300 rounded-full flex items-center text-sm font-medium">
            Timings <FaChevronDown className="ml-1" />
          </button>
        </div>
      </section>

      {/* Venue Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-[13px] sm:px-[100px] py-10">
        {loading ? (
          <p>Loading venues...</p>
        ) : filteredVenues.length > 0 ? (
          filteredVenues.map((venue, index) => (
            <SportsGardenCard
              key={index}
              garden={{
                ...venue,
                image: `http://localhost:8000/uploads/${venue.image}`,
              }}
            />
          ))
        ) : (
          <p>No venues found.</p>
        )}
      </section>
    </main>
  );
}

export default SportsVenue;
