import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaFutbol,
  FaRupeeSign,
  FaShareAlt,
  FaDirections, // Added for clarity for directions button
  FaCheckCircle, // For amenities
  FaBaseballBall, // Example for other sports if needed
  FaSwimmer,
  FaDumbbell,
  FaBasketballBall, // Specific for basketball
  FaTableTennis, // Specific for table tennis
 // Specific for badminton
} from "react-icons/fa";
import { GiCricketBat, GiShuttlecock } from "react-icons/gi"; // ✅ Import both correctly

// import { GiShuttlecock } from "react-icons/gi"; // ✅ Correct shuttlecock icon from Game Icons

import Sidebar from "./Sidebar"; // ✅ Adjust this path if needed
import { FaBars } from "react-icons/fa"; // For toggle button

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ Sidebar toggle state

  // Dummy Images for Carousel - Replace with actual venue images if available
  const carouselImages = [
    "http://googleusercontent.com/image_generation_content/1", // Modern sports complex - daylight
    "http://googleusercontent.com/image_generation_content/2", // Sports complex - evening lights
    "http://googleusercontent.com/image_generation_content/3", // Indoor sports center
    "http://googleusercontent.com/image_generation_content/4", // Family-friendly garden
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Basic auto-carousel functionality
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % carouselImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/venues/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setVenue(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch venue", err);
        setLoading(false);
        // Optionally navigate to a 404 page or show an error message
        // navigate('/404');
      });
  }, [id, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-700 animate-pulse">Loading venue details...</p>
      </div>
    );
  if (!venue)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl text-red-600">Venue not found or an error occurred.</p>
      </div>
    );

  const sports = Array.isArray(venue?.sports)
    ? venue.sports
    : (venue?.sports || "").split(",").map((s) => s.trim()).filter(s => s !== ""); // Ensure trimming and filter empty

  const amenities = Array.isArray(venue?.amenities)
    ? venue.amenities
    : (venue?.amenities || "").split(",").map((a) => a.trim()).filter(a => a !== ""); // Ensure trimming and filter empty


  // Helper function to get sport icon
  const getSportIcon = (sportName) => {
    const lowerCaseSport = sportName.toLowerCase();
    if (lowerCaseSport.includes("cricket")) return <GiCricketBat />;
    if (lowerCaseSport.includes("football")) return <FaFutbol />;
    if (lowerCaseSport.includes("basketball")) return <FaBasketballBall />;
    if (lowerCaseSport.includes("table tennis") || lowerCaseSport.includes("ping pong")) return <FaTableTennis />;
 if (lowerCaseSport.includes("badminton")) return <GiShuttlecock />;

    // Add more icons for other sports as needed
    return null; // Default if no icon matches
  };


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      {/* Sidebar Toggle */}
      <div className="fixed top-4 left-4 z-[1003]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-3 bg-white rounded-full shadow-lg text-blue-700 hover:bg-blue-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Open sidebar"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Sidebar */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Back Button */}
      <div className="absolute top-4 right-4 z-[1002] sm:top-6 sm:right-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg text-blue-600 hover:bg-blue-100 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Main Content Area - Full width on all screens */}
      <div className="w-full max-w-full mx-auto pb-12">
        {/* Hero Image / Carousel */}
        <div className="relative h-[300px] sm:h-[450px] md:h-[550px] lg:h-[650px] overflow-hidden shadow-xl">
          <img
            src={
              venue?.image
                ? `http://localhost:8000/uploads/${venue.image}`
                : carouselImages[currentImageIndex] // Fallback to carousel images
            }
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

          {/* Venue Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                  {venue.name}
                </h1>
                <div className="mt-2 flex items-center gap-3 text-lg sm:text-xl text-gray-200 drop-shadow">
                  <FaMapMarkerAlt className="text-blue-300" />
                  <p className="font-medium">{venue.location?.address || venue.address}</p>
                </div>
                <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-yellow-400 mt-2 drop-shadow">
                  <FaStar />
                  <span>{venue.rating || "4.5"}</span>
                  <span className="text-gray-300 text-sm font-normal ml-1">(based on reviews)</span>
                </div>
              </div>
              {/* <div className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-green-400 drop-shadow">
                <FaRupeeSign />
                <span className="text-white">Price:</span> {venue.pricing || "Contact for pricing"}
              </div> */}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-8 lg:p-12">

          {/* Main Description & Details (Left/Center Column) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-blue-100 transform hover:scale-[1.005] transition-transform duration-300">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-800 border-b-2 border-blue-200 pb-2">
                About {venue.name}
              </h2>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                {venue.description || "No description provided by venue owner. This premium sports facility offers state-of-the-art equipment and a vibrant atmosphere for all sports enthusiasts."}
              </p>
            </section>

            {/* Sports Available */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-blue-100 transform hover:scale-[1.005] transition-transform duration-300">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-800 border-b-2 border-blue-200 pb-2">
                Sports Available
              </h2>
              {sports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sports.map((sport, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-blue-50 text-blue-800 px-5 py-3 rounded-xl text-base capitalize font-medium shadow-sm hover:bg-blue-100 transition-colors duration-200"
                    >

                      <span>{sport}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">No specific sports listed, please contact the venue.</p>
              )}
            </section>
               {/* Amenities */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-blue-100 transform hover:scale-[1.005] transition-transform duration-300">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-800 border-b-2 border-blue-200 pb-2">
                Amenities
              </h2>
              {amenities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {amenities.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-gray-50 text-gray-700 px-5 py-3 rounded-xl text-base font-medium shadow-sm hover:bg-gray-100 transition-colors duration-200"
                    >
                      <FaCheckCircle className="text-green-500" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 italic">No specific amenities listed.</p>
              )}
            </section>
          </div>

          {/* Amenities & Action Buttons (Right Column) */}
          <div className="lg:col-span-1 space-y-8">
         

            {/* Share + Direction Buttons */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-blue-100 transform hover:scale-[1.005] transition-transform duration-300">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-800 border-b-2 border-blue-200 pb-2">
                Connect & Locate
              </h2>
              <div className="flex flex-col  gap-4">
           <button
  onClick={() => {
    if (navigator.share) {
      navigator
        .share({
          title: venue.name,
          text: `Check out this venue: ${venue.name}`,
          url: window.location.href,
        })
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.error("Error sharing", error));
    } else {
      // Fallback for unsupported browsers
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy the link."));
    }
  }}
  className="flex-1 flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-full text-lg text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <FaShareAlt /> Share
</button>


               <button
  onClick={() => {
    const lat = venue.location?.lat;
    const lng = venue.location?.lng;

    if (lat && lng) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(mapsUrl, '_blank');
    } else {
      alert("Coordinates not available.");
    }
  }}
  className="flex-1 flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-full text-lg text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <FaMapMarkerAlt /> Directions
</button>


              </div>
            </section>

            {/* Booking Button */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-blue-100 transform hover:scale-[1.005] transition-transform duration-300">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-800 border-b-2 border-blue-200 pb-2">
                Ready to Play?
              </h2>
              <button
                onClick={() => navigate(`/user/booking/${id}`)}
                className="w-full bg-blue-600 text-white text-xl font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Book Now
              </button>
            </section>

            {/* Optional: Sticky Booking Button at bottom for better UX on long scrolls */}
            {/* <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl p-4 sm:p-6 border-t border-gray-200 z-50 lg:hidden">
              <button
                onClick={() => navigate(`/user/booking/${id}`)}
                className="w-full bg-blue-600 text-white text-lg font-bold px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md"
              >
                Book Your Slot Now!
              </button>
            </div> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;