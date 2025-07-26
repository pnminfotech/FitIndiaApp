import React, { useEffect, useState, useMemo } from "react";
import logo3 from "../../assets/logo3.jpeg"; // ✅ Updated logo
import SportsGardens from "../../components/SportsGardens";
import DateButtonWithPicker from "../../components/DateButtonWithPicker";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import Slider from "react-slick";
import { FiPhone } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { GoLocation } from "react-icons/go";


 // Ensure react-slick and slick-carousel CSS are imported globally
import { FiMail, FiMapPin, FiArrowRight } from "react-icons/fi"; // Using FiArrowRight for consistent icon style
import { HiOutlineLightningBolt, HiOutlineGlobeAlt, HiOutlineUsers } from "react-icons/hi"; // Stronger feature icons

// Assuming these are high-quality, vibrant sports-related images
import carouselHero1 from "../../assets/garden1.png";
import carouselHero2 from "../../assets/garden2.png";
import carouselHero3 from "../../assets/garden3.png";
import carouselHero4 from "../../assets/garden4.png";
import carouselHero5 from "../../assets/garden5.png";
import coachPortrait from "../../assets/coach.png"; // High-quality image of a coach

import carosoule1 from "../../assets/carosoule1.jpeg";
import carosoule2 from "../../assets/carosoule1.png";
import carosoule3 from "../../assets/carosoule4.jpeg";
import carosoule4 from "../../assets/carosoule5.png";
import carosoule5 from "../../assets/carosoule6.jpeg";
import coach from "../../assets/coach.png";
const TIME_BUCKETS = [
  { label: "Morning", from: "05:00", to: "12:00" },
  { label: "Afternoon", from: "12:00", to: "17:00" },
  { label: "Evening", from: "17:00", to: "23:59" },
];

function Homepage() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedAmenity, setSelectedAmenity] = useState("All");
  const [selectedTiming, setSelectedTiming] = useState("All");
  const [dateText, setDateText] = useState("");

  const googleFormUrl = "https://forms.gle/ph5DXNoyDCCqKj6N9";
const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    fetch("http://localhost:8000/api/venues")
      .then((res) => res.json())
      .then((data) => {
        setVenues(data);
        setFilteredVenues(data.slice(0, 8));
      })
      .catch((err) => console.error("Failed to fetch venues:", err));
  }, []);

  const uniqueCities = useMemo(
    () => ["All Cities", ...new Set(venues.map((v) => v.city).filter(Boolean))],
    [venues]
  );

  const uniqueSports = useMemo(
    () => ["All", ...new Set(venues.flatMap((v) => v.sports || []))],
    [venues]
  );

  const uniqueAmenities = useMemo(
    () => ["All", ...new Set(venues.flatMap((v) => v.amenities || []))],
    [venues]
  );

  const filterVenues = () => {
    let result = [...venues];

    if (selectedCity !== "All Cities") {
      result = result.filter((v) => v.city === selectedCity);
    }

    if (selectedSport !== "All") {
      result = result.filter((v) => v.sports?.includes(selectedSport));
    }

    if (selectedAmenity !== "All") {
      result = result.filter((v) => v.amenities?.includes(selectedAmenity));
    }

    if (selectedTiming !== "All") {
      const range = TIME_BUCKETS.find((t) => t.label === selectedTiming);
      result = result.filter((v) =>
        v.courts?.some((c) =>
          c.slots?.some(
            (s) => s.startTime >= range.from && s.startTime < range.to
          )
        )
      );
    }

    setFilteredVenues(result.slice(0, 8));
  };

  useEffect(() => {
    filterVenues();
  }, [selectedCity, selectedSport, selectedAmenity, selectedTiming]);

  const handleOpenForm = () => {
    window.open(googleFormUrl, "_blank");
  };

  return (
    <>
      {/* NavBar */}
    {/* NavBar */}
<nav className="bg-gray-50  sticky top-0 z-50 ">
  <div className="flex justify-between items-center h-[70px] sm:h-[100px] px-4 sm:px-8">
    {/* Logo & Title */}
    <div className="flex items-center gap-4">
      <img src={logo3} alt="Fit India Logo" className="h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] rounded-full" />
      <h1 className="text-[22px] sm:text-[26px] font-bold text-blue-800 cursor-pointer">Get Fit India</h1>
    </div>

    {/* Desktop Links */}
    <div className="hidden md:flex items-center gap-4">
      <a href="/user/sportsvenue" target="_blank" rel="noopener noreferrer" className="text-[18px] sm:text-[16px] md:text-[18px] font-medium hover:underline underline-offset-4 decoration-blue-500">
        SPORTS VENUES
      </a>
      <a href="/user/coaching" target="_blank" rel="noopener noreferrer" onClick={handleOpenForm} className="text-[18px] sm:text-[16px] md:text-[18px] font-medium hover:underline underline-offset-4 decoration-blue-500">
        COACHING
      </a>
      <a href="/user/events" target="_blank" rel="noopener noreferrer" className="text-[18px] sm:text-[16px] md:text-[18px] font-medium hover:underline underline-offset-4 decoration-blue-500">
        EVENTS
      </a>
      <a
        href="/login"
        className="text-[16px] sm:text-[18px] font-bold px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-full transition"
      >
        Log In
      </a>
    </div>

    {/* Mobile Toggle Button */}
    <div className="md:hidden">
      <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-blue-800">
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </div>
  </div>

  {/* Mobile Dropdown Menu */}
  {menuOpen && (
    <div className="md:hidden px-4 py-3 space-y-3 bg-white shadow-md border-t border-gray-200">
      <a href="/user/sportsvenue" className="block text-blue-800 font-medium" onClick={() => setMenuOpen(false)}>SPORTS VENUES</a>
      <a href="/user/coaching" className="block text-blue-800 font-medium" onClick={() => {
        handleOpenForm();
        setMenuOpen(false);
      }}>COACHING</a>
      <a href="/user/events" className="block text-blue-800 font-medium" onClick={() => setMenuOpen(false)}>EVENTS</a>
      <a href="/login" className="block text-white bg-blue-800 text-center py-2 rounded-full font-semibold" onClick={() => setMenuOpen(false)}>Log In</a>
    </div>
  )}
</nav>


{/* Carousel Banner */}
{/* Carousel Banner */}
<section className="px-0 sm:px-[80px] pt-4 pb-6">
  <Slider
    autoplay
    autoplaySpeed={4000}
    dots
    infinite
    speed={800}
    slidesToShow={1}
    slidesToScroll={1}
    arrows={false}
    pauseOnHover
    className="rounded-xl overflow-hidden"
  >
    {[
      
      {
        url: carosoule2,
        caption: "Elite Coaching Facilities",
      },
      {
        url: carosoule3,
        caption: "Book Sports Venues Instantly",
      },
      {
        url: carosoule4,
        caption: "Train with Top Coaches",
      },
      {
        url: carosoule5,
        caption: "Weekend Sports Events & Tournaments",
      },
      {
        url: carosoule1,
        caption: "Top Turf Grounds near you",
      },
    ].map((item, index) => (
      <div key={index} className="relative">
        <img
          src={item.url}
          alt={item.caption}
          className="w-full h-[280px] sm:h-[500px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h3 className="text-white text-xl sm:text-3xl font-bold drop-shadow-md text-center px-4">
            {item.caption}
          </h3>
        </div>
      </div>
    ))}
  </Slider>
</section>


 

      {/* Hero / Welcome */}
      <section className="mt-1 text-center ">
        <p className="text-2xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
        Discover Your Next <span className="text-blue-800">Playing Field</span>
        </p>
       <p className="text-sm font-extrabold text-gray-900 mb-10 text-center leading-tight">
          Explore Our Top Venues
        </p>
      </section>

      {/* Main Filters Section */}
      <section className=" px-4 sm:px-16  md:py-8 lg:py-10 bg-white text-black">
        {/* Select City */}
        <div className="mb-4 ">
          <Dropdown
            label="Select City"
            options={uniqueCities}
            selected={selectedCity}
            onChange={setSelectedCity}
          className="text-black"
          />
        </div>

        {/* Other Filters */}
        <div className="flex flex-wrap gap-4 items-center">
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
          {dateText && <p className="text-sm text-gray-600">Selected: {dateText}</p>}

          <Dropdown
            label="Amenities"
            options={uniqueAmenities}
            selected={selectedAmenity}
            onChange={setSelectedAmenity}
          />

          <Dropdown
            label="Sports"
            options={uniqueSports}
            selected={selectedSport}
            onChange={setSelectedSport}
          />

          <Dropdown
            label="Timings"
            options={["All", ...TIME_BUCKETS.map((t) => t.label)]}
            selected={selectedTiming}
            onChange={setSelectedTiming}
          />
        </div>
      </section>

      {/* Venues Preview */}
      <section className="px-[13px] sm:px-[80px] pb-16">
        <h2 className="text-xl font-bold mb-4 mt-3">Popular Sports Venues</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVenues.length === 0 ? (
            <p>No venues found.</p>
          ) : (
            filteredVenues.slice(0, 8).map((venue, index) => (
              <SportsGardens
                key={index}
                garden={{
                  ...venue,
                  image: `http://localhost:8000/uploads/${venue.image}`,
                }}
              />
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <a
            href="/user/sportsvenue"
            className="inline-flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl transition transform hover:scale-105 active:scale-95 ease-out-back group relative overflow-hidden"
          >
            View All Venues
          </a>
        </div>
      </section>

<section className="relative px-4 sm:px-16 pt-8 pb-12 bg-white overflow-hidden min-h-[650px] flex items-center justify-center">
        {/* Background Carousel */}
        <div className="absolute inset-0">
          <Slider
            autoplay
            autoplaySpeed={5500}
            dots={false}
            infinite
            fade={true}
            speed={1200}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={false}
            pauseOnHover={false}
            className="w-full h-full"
          >
            {[
              carouselHero1,
              carouselHero2,
              carouselHero3,
              carouselHero4,
              carouselHero5,
            ].map((imgUrl, index) => (
              <div key={index} className="w-full h-full">
                <img
                  src={imgUrl}
                  alt={`Sports scene ${index + 1}`}
                  className="w-full h-full object-cover object-center transform scale-110 animate-zoom-in" // Stronger zoom animation
                />
              </div>
            ))}
          </Slider>
          {/* Overlay for text readability and premium feel */}
          <div className="absolute inset-0 bg-black/65 backdrop-brightness-75 animate-fade-in" style={{ backgroundColor: '#0a0a0a80' }}></div> {/* Darker overlay, fade in */}
        </div>

        {/* Hero Content (Text & Call to Action) */}
        <div className="relative z-20 text-center text-white max-w-5xl mx-auto px-6 py-10 rounded-2xl bg-white/10 backdrop-blur-xl shadow-3xl border border-white/20 animate-fade-in-up delay-300 transform scale-95"> {/* Larger padding, more blur, stronger shadow, subtle initial scale */}
          <h2 className="text-2xl   sm:text-3xl md:text-3xl font-extrabold mb-6 leading-tight drop-shadow-lg  animate-text-reveal"> {/* New text reveal animation */}
            Unleash Your Potential. <br className="hidden sm:inline" />
            <span className="text-yellow-300">Play Beyond Limits.</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-xl text-white opacity-90 max-w-3xl mx-auto mb-12 drop-shadow-md animate-fade-in-up delay-700">
            "Get Fit India" is your premier platform to discover & book top-tier sports venues, and connect with certified coaches for an unparalleled fitness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-1000">
            <a
              href="/user/sportsvenue"
              className="inline-flex items-center justify-center bg-gradient-to-br from-blue-800 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl transition transform hover:scale-105 active:scale-95 ease-out-back group relative overflow-hidden"
            >
              <span className="relative z-10" style={{fontSize:14}}>Find a Venue</span>
              <FiArrowRight className="ml-3 text-2xl group-hover:translate-x-1 transition-transform duration-300" /> {/* Arrow icon with hover effect */}
              <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-0 transition-opacity duration-300"></span>
            </a>
            <button
              onClick={handleOpenForm}
              className="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 border border-white/30 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl transition transform hover:scale-105 active:scale-95 ease-out-back backdrop-blur-sm group relative overflow-hidden"
            >
              <span className="relative z-10" style={{fontSize:14}}>Register as Coach</span>
              <FiArrowRight className="ml-3 text-2xl group-hover:translate-x-1 transition-transform duration-300" />
              <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-0 transition-opacity duration-300"></span>
            </button>
          </div>
        </div>
      </section>
      
{/*Coach sction */}

      <section className="w-[80%] mx-auto bg-gradient-to-br from-teal-500 to-blue-900 px-4 sm:px-8 py-20 mt-20 rounded-t-[30px]  md:rounded-t-[80px] rounded-bl-[80px] shadow-3xl overflow-hidden relative z-10">
  {/* Abstract shapes in background */}
  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
    <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="#ffffff" fillOpacity="0.1" d="M0,160L48,160C96,160,192,160,288,144C384,128,480,96,576,90.7C672,85,768,107,864,138.7C960,171,1056,213,1152,208C1248,203,1344,155,1392,130.7L1440,107L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
      <path fill="#ffffff" fillOpacity="0.05" d="M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,213.3C672,235,768,245,864,229.3C960,213,1056,171,1152,160C1248,149,1344,171,1392,181.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
    </svg>
  </div>

  <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 text-white max-w-full">
    {/* Text Section */}
    <div className="md:w-1/2 md:ps-3 text-center md:text-left animate-fade-in-up delay-200">
      <h2 className="text-2xl   sm:text-3xl md:text-3xl font-extrabold mb-6 leading-tight drop-shadow-lg">
        Empower Your Coaching Career
        <br className="hidden sm:inline" />
        <span className="text-yellow-200">Join Our Elite Network!</span>
      </h2>
      <p className="text-base sm:text-lg md:text-xl mb-8 opacity-95 leading-relaxed">
        Are you a passionate, <strong>certified sports coach</strong> aiming to make a bigger impact?
        Partner with Get Fit India to connect with a vast pool of eager students and unlock new
        opportunities across the country.
      </p>
      <button
        onClick={handleOpenForm}
        className="bg-white text-teal-700 hover:bg-gray-100 font-semibold text-lg sm:text-xl px-8 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 duration-300 ease-out"
      >
        Start Coaching Today
      </button>
    </div>

    {/* Image Section */}
    <div className="md:w-1/2 flex justify-center order-first md:order-last animate-fade-in-up delay-400">
      <img
        src={coachPortrait}
        alt="Professional Sports Coach"
        className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] rounded-3xl shadow-2xl object-cover object-top border-4 border-white/30 transition-transform duration-500 hover:scale-105 ease-out"
      />
    </div>
  </div>
</section>

 {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-24 py-16 px-4 sm:px-16 relative z-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center sm:text-left max-w-7xl mx-auto">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-5">About Get Fit India</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get Fit India is dedicated to building a vibrant sports community by connecting enthusiasts with premier venues and expert coaches. We make it easy to book, play, and stay active, fostering a healthier, fitter India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-5">Quick Links</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="/user/sportsvenue" className="hover:text-blue-300 transition-colors duration-200">Sports Venues</a>
              </li>
              <li>
                <a href="/user/coaching" className="hover:text-blue-300 transition-colors duration-200">Coaching</a>
              </li>
              <li>
                <a href="/user/events" className="hover:text-blue-300 transition-colors duration-200">Events</a>
              </li>
              <li>
                <a href="/login" className="hover:text-blue-300 transition-colors duration-200">Log In</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-5">Support</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-blue-300 transition-colors duration-200">FAQ</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300 transition-colors duration-200">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300 transition-colors duration-200">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold text-blue-400 mb-5">Connect With Us</h3>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-gray-400 text-sm mb-2">
              <FiPhone className="text-blue-300 text-lg" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-gray-400 text-sm mb-2">
              <FiMail className="text-blue-300 text-lg" />
              <span>support@getfitindia.in</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3 text-gray-400 text-sm">
              <FiMapPin className="text-blue-300 text-lg" />
              <span>Pune, Maharashtra, India</span>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-700 pt-10 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Get Fit India. All rights reserved.
          <p className="mt-2 text-xs text-gray-600">Built with Passion in India.</p>
        </div>
      </footer>

      {/* --- */}

      {/* Global CSS Animations & Custom Easing */}
      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-down {
          animation: slideInDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; /* Custom cubic-bezier for slide */
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scale-in {
          animation: scaleIn 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; /* Springy effect */
          opacity: 0; /* Start hidden */
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .ease-out-back {
          transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Smooth, slightly bouncy transition */
        }

        .ease-out-expo {
          transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1); /* Fast out, slow in */
        }

        /* Active scale for buttons on click */
        .active\\:scale-95:active {
          transform: scale(0.95);
        }

        /* Unique shadows for distinct elements */
        .shadow-3xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 10px 10px -5px rgba(0, 0, 0, 0.15);
        }
      `}</style>

    </>
  );
}

const Dropdown = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 text-blue-500 border border-gray-300 rounded-full flex items-center text-sm font-medium"
      >
        {label}: {selected} <FaChevronDown className="ml-1" />
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-48 bg-white shadow-lg rounded border max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt}
              className={`px-4 py-2 text-sm hover:bg-blue-100 cursor-pointer ${
                selected === opt ? "font-semibold text-blue-800" : ""
              }`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
          {selected !== "All" && (
            <div
              className="px-4 py-2 text-sm text-red-500 hover:bg-red-100 cursor-pointer"
              onClick={() => {
                onChange("All");
                setOpen(false);
              }}
            >
              <FaTimes className="inline mr-2" />
              Clear
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Homepage;
