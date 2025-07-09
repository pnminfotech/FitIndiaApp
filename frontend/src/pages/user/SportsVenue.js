import React, { useState, useEffect } from "react";
import { FaFilter, FaChevronDown } from "react-icons/fa";
import Header from "../../components/Header";
import SportsGardenCard from "../../components/SportsGardenCard";
import SportsDropdown from "../../components/SportsDropdown";
import DateButtonWithPicker from "../../components/DateButtonWithPicker";

function SportsVenue() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [dateText, setDateText] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleDateChange = (selectedDate) => {
    const key = selectedDate.toISOString().split("T")[0];
    const availableNamesByDate = {
      "2025-06-24": ["Indoor Hall A", "Outdoor Turf 1"],
      "2025-06-25": ["Swimming Pool", "Tennis Court"],
      "2025-06-26": [],
    };

    const formatted = selectedDate.toLocaleDateString("default", {
      month: "long",
      weekday: "short",
      day: "numeric",
    });

    setDateText(formatted);

    const availableNames = availableNamesByDate[key] || [];
    const filtered = venues.filter((venue) =>
      availableNames.includes(venue.name)
    );
    setFilteredVenues(filtered);
  };

  return (
    <main>
      <Header />

      {/* Filters Section */}
      <section className="pt-12 px-[13px] sm:px-[100px]">
        <div className="flex justify-between items-center">
          <h1 className=" text-xs font-bold">
            AVAILABLE VENUES <span className="text-gray-500">({filteredVenues.length})</span>
          </h1>
          <button className="text-blue-500 font-semibold text-lg border-none flex items-center gap-2">
            <FaFilter />
            FILTER
          </button>
        </div>

        <div className="flex items-center gap-6 pt-6 flex-wrap">
          <div>
            <DateButtonWithPicker onDateChange={handleDateChange} />
            {dateText && (
              <div className="mt-4">
                <h3 className="font-semibold">Available Venues on {dateText}:</h3>
                {filteredVenues.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {filteredVenues.map((v, idx) => (
                      <li key={idx}>{v.name}</li>
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

      {/* Venue Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-[13px] sm:px-[100px]  py-10">
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
