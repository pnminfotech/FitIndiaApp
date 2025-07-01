import React, { useState } from "react";
import { FaFilter, FaChevronDown } from "react-icons/fa";
import Header from "../../components/Header";
import sportsGardenData from "../../jsondata/SportVenue.json";
import SportsGardenCard from "../../components/SportsGardenCard";
import SportsDropdown from "../../components/SportsDropdown";
import DateButtonWithPicker from "../../components/DateButtonWithPicker";

const availableVenuesByDate = {
  "2025-06-24": ["Indoor Hall A", "Outdoor Turf 1"],
  "2025-06-25": ["Swimming Pool", "Tennis Court"],
  "2025-06-26": [],
};

function SportsVenue() {
  const [venues, setVenues] = useState([]);
  const [dateText, setDateText] = useState("");

  const handleDateChange = (selectedDate) => {
    const key = selectedDate.toISOString().split("T")[0];
    const formatted = selectedDate.toLocaleDateString("default", {
      month: "long",
      weekday: "short",
      day: "numeric",
    });
    setDateText(formatted);
    setVenues(availableVenuesByDate[key] || []);
  };

  return (
    <main>
      <Header />

      {/* First carousel section (add later) */}
      <section></section>

      {/* Available Venues Section */}
      <section className="pt-12 px-[100px]">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            AVAILABLE VENUES <span className="text-gray-500">(211)</span>
          </h1>
          <button className="text-blue-500 font-semibold text-lg border-none flex items-center gap-2">
            <FaFilter />
            FILTER
          </button>
        </div>

        {/* Filters: Date Picker, Sports, Amenities, Timings */}
        <div className="flex items-center gap-6 pt-6 flex-wrap">
          <div>
            <DateButtonWithPicker onDateChange={handleDateChange} />
            {dateText && (
              <div className="mt-4">
                <h3 className="font-semibold">Available Venues on {dateText}:</h3>
                {venues.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {venues.map((venue, index) => (
                      <li key={index}>{venue}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No venues available.</p>
                )}
              </div>
            )}
          </div>

          <hr className="h-[40px] border-l border-gray-300" />

          <SportsDropdown />

          <button className="px-4 py-2 text-blue-500 border border-gray-300 rounded-full flex items-center text-sm font-medium">
            Amenities <FaChevronDown className="ml-1" />
          </button>

          <button className="px-4 py-2 text-blue-500 border border-gray-300 rounded-full flex items-center text-sm font-medium">
            Timings <FaChevronDown className="ml-1" />
          </button>
        </div>
      </section>

      {/* Sports Garden Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-[100px] py-10">
        {sportsGardenData.map((garden, index) => (
          <SportsGardenCard key={index} garden={garden} />
        ))}
      </section>
    </main>
  );
}

export default SportsVenue;
