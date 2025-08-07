import React, { useEffect, useState, useMemo } from "react";
import logo3 from "../../assets/logo3.jpeg"; // Ensure this is a high-res, clean logo
import SportsGardenCard from "../../components/SportsGardenCard"; // This component needs to match the new aesthetic
import DateButtonWithPicker from "../../components/DateButtonWithPicker"; // This component needs to match the new aesthetic
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import Slider from "react-slick";
import { FiPhone, FiMail, FiMapPin, FiCheckCircle } from "react-icons/fi"; // More refined icons
import { HiOutlineLightningBolt, HiOutlineGlobeAlt, HiOutlineUsers } from "react-icons/hi"; // Stronger feature icons

// Import higher quality or more diverse carousel images if available
import carouselHero1 from "../../assets/carosoule1.jpeg";
import carouselHero2 from "../../assets/carosoule1.png";
import carouselHero3 from "../../assets/carosoule4.jpeg";
import carouselHero4 from "../../assets/carosoule5.png";
import carouselHero5 from "../../assets/carosoule6.jpeg";
import coachPortrait from "../../assets/coach.png"; // High-quality image of a coach

// Consider adding more relevant background patterns or textures
// import patternBackground from "../../assets/pattern-bg.svg"; // Example for a subtle background texture

const TIME_BUCKETS = [
  { label: "Morning (05 AM - 12 PM)", from: "05:00", to: "12:00" },
  { label: "Afternoon (12 PM - 05 PM)", from: "12:00", to: "17:00" },
  { label: "Evening (05 PM - 12 AM)", from: "17:00", to: "23:59" },
];

function Rought() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedAmenity, setSelectedAmenity] = useState("All");
  const [selectedTiming, setSelectedTiming] = useState("All");
  const [dateText, setDateText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const googleFormUrl = "https://forms.gle/ph5DXNoyDCCqKj6N9";

  useEffect(() => {
    fetch("https://api.getfitindia.in/api/venues")
      .then((res) => res.json())
      .then((data) => {
        setVenues(data);
        setFilteredVenues(data.slice(0, 12));
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

    setFilteredVenues(result.slice(0, 12));
  };

  useEffect(() => {
    filterVenues();
  }, [selectedCity, selectedSport, selectedAmenity, selectedTiming, venues]);

  const handleOpenForm = () => {
    window.open(googleFormUrl, "_blank");
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white font-sans text-gray-900 antialiased overflow-x-hidden"> {/* Deeper gradient, darker text */}
      {/* NavBar */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-xl sticky top-0 z-50 transition-all duration-300 ease-in-out px-4 sm:px-16 py-3 border-b border-blue-50"> {/* Frosted glass effect, stronger shadow, border */}
        <div className="flex justify-between items-center h-[75px] sm:h-[95px]">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 md:gap-4">
            <img
              src={logo3}
              alt="Fit India Logo"
              className="h-[55px] w-[55px] sm:h-[65px] sm:w-[65px] rounded-full object-cover shadow-lg transform transition-transform hover:scale-105"
            />
            <h1 className="text-[32px] sm:text-[48px] font-extrabold text-blue-800 cursor-pointer tracking-tighter"> {/* Larger, bolder, tighter tracking */}
              Get Fit India
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 lg:gap-14"> {/* Increased gap */}
            <a
              href="/user/sportsvenue"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[18px] sm:text-[20px] font-semibold text-gray-700 hover:text-blue-700 transition-colors duration-200 relative group py-2" // Larger, slightly bolder, more padding
            >
              SPORTS VENUES
              <span className="absolute left-0 bottom-0.5 h-1 bg-blue-600 w-0 group-hover:w-full transition-all duration-300 rounded-full"></span> {/* Thicker underline */}
            </a>
            <a
              href="/user/coaching"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOpenForm}
              className="text-[18px] sm:text-[20px] font-semibold text-gray-700 hover:text-blue-700 transition-colors duration-200 relative group py-2"
            >
              COACHING
              <span className="absolute left-0 bottom-0.5 h-1 bg-blue-600 w-0 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </a>
            <a
              href="/user/events"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[18px] sm:text-[20px] font-semibold text-gray-700 hover:text-blue-700 transition-colors duration-200 relative group py-2"
            >
              EVENTS
              <span className="absolute left-0 bottom-0.5 h-1 bg-blue-600 w-0 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </a>
            <a
              href="/login"
              className="text-[18px] sm:text-[20px] font-bold px-8 py-3.5 bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-full shadow-lg transition transform hover:scale-105 active:scale-95 ease-out-back" // Smoother easing
            >
              Log In
            </a>
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-4xl text-blue-700 focus:outline-none transition-transform transform active:scale-90"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden px-6 py-5 space-y-4 bg-white shadow-inner border-t border-gray-100 animate-slide-in-down"> {/* Slide-in animation */}
            <a
              href="/user/sportsvenue"
              className="block text-blue-700 font-semibold text-xl py-2.5 hover:bg-blue-50 rounded-lg transition duration-150"
              onClick={() => setMenuOpen(false)}
            >
              SPORTS VENUES
            </a>
            <a
              href="/user/coaching"
              className="block text-blue-700 font-semibold text-xl py-2.5 hover:bg-blue-50 rounded-lg transition duration-150"
              onClick={() => {
                handleOpenForm();
                setMenuOpen(false);
              }}
            >
              COACHING
            </a>
            <a
              href="/user/events"
              className="block text-blue-700 font-semibold text-xl py-2.5 hover:bg-blue-50 rounded-lg transition duration-150"
              onClick={() => setMenuOpen(false)}
            >
              EVENTS
            </a>
            <a
              href="/login"
              className="block text-white bg-gradient-to-br from-blue-600 to-blue-800 text-center py-4 rounded-full font-bold mt-5 shadow-md hover:from-blue-700 hover:to-blue-900 transition"
              onClick={() => setMenuOpen(false)}
            >
              Log In
            </a>
          </div>
        )}
      </nav>

      ---

      {/* Hero Section with Carousel & Dynamic Headline */}
      <section className="relative px-4 sm:px-16 pt-8 pb-12 bg-white overflow-hidden min-h-[600px] flex items-center justify-center"> {/* Larger section, centered content */}
        {/* Background Carousel */}
        <div className="absolute inset-0">
          <Slider
            autoplay
            autoplaySpeed={5500}
            dots={false} // No dots on background carousel
            infinite
            fade={true} // Smooth fade effect
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
                  className="w-full h-full object-cover object-center transform scale-105" // Slight zoom effect
                />
              </div>
            ))}
          </Slider>
          {/* Overlay for text readability and premium feel */}
          <div className="absolute inset-0 bg-black/60 backdrop-brightness-75"></div> {/* Darker, slightly desaturated overlay */}
        </div>

        {/* Hero Content (Text & Call to Action) */}
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4 py-8 rounded-xl bg-white/10 backdrop-blur-md shadow-2xl border border-white/20 animate-fade-in-up delay-300"> {/* Frosted card effect */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-5 leading-tight drop-shadow-lg animate-scale-in">
            Unleash Your Potential. <br className="hidden sm:inline" />
            <span className="text-yellow-300">Play Beyond Limits.</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto mb-10 drop-shadow-md animate-fade-in-up delay-500">
            **Get Fit India** is your premier platform to discover & book top-tier sports venues, and connect with certified coaches for an unparalleled fitness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up delay-700">
            <a
              href="/user/sportsvenue"
              className="inline-block bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl transition transform hover:scale-105 active:scale-95 ease-out-back"
            >
              Find a Venue
            </a>
            <button
              onClick={handleOpenForm}
              className="inline-block bg-white/20 hover:bg-white/30 border border-white/30 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl transition transform hover:scale-105 active:scale-95 ease-out-back backdrop-blur-sm"
            >
              Register as Coach
            </button>
          </div>
        </div>
      </section>

      ---

      {/* Unique Selling Proposition (USP) Section */}
      <section className="px-4 sm:px-16 py-20 bg-gradient-to-br from-white to-blue-50">
        <h2 className="text-4xl font-extrabold text-center mb-16 leading-tight">
          Your Ultimate Sports <span className="text-blue-700">Companion</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg border border-blue-100 transform hover:-translate-y-2 transition-transform duration-300 ease-out-expo">
            <div className="p-4 bg-blue-100 rounded-full mb-6 shadow-md border border-blue-200">
              <HiOutlineLightningBolt className="text-blue-600 text-6xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Instant Access</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Book your favorite sports facilities anytime, anywhere. Real-time availability ensures you never miss a slot.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg border border-green-100 transform hover:-translate-y-2 transition-transform duration-300 ease-out-expo">
            <div className="p-4 bg-green-100 rounded-full mb-6 shadow-md border border-green-200">
              <HiOutlineGlobeAlt className="text-green-600 text-6xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Nationwide Network</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Explore a vast network of verified venues and certified coaches across major cities in India.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-lg border border-purple-100 transform hover:-translate-y-2 transition-transform duration-300 ease-out-expo">
            <div className="p-4 bg-purple-100 rounded-full mb-6 shadow-md border border-purple-200">
              <HiOutlineUsers className="text-purple-600 text-6xl" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Community & Events</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Connect with fellow enthusiasts, form teams, and participate in exciting local tournaments and events.
            </p>
          </div>
        </div>
      </section>

      ---

      {/* Filters & Discovery Section */}
      <section className="px-4 sm:px-16 py-16 bg-blue-50/70 rounded-tl-[60px] rounded-br-[60px] shadow-2xl overflow-hidden relative z-10"> {/* Unique shape and strong shadow */}
        <h3 className="text-4xl font-extrabold text-gray-900 mb-12 text-center leading-tight">
          Discover Your Next <span className="text-blue-700">Playing Field</span>
        </h3>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 items-center max-w-6xl mx-auto">
          <Dropdown
            label="City"
            options={uniqueCities}
            selected={selectedCity}
            onChange={setSelectedCity}
          />

          <Dropdown
            label="Sport"
            options={uniqueSports}
            selected={selectedSport}
            onChange={setSelectedSport}
          />

          <DateButtonWithPicker
            onDateChange={(date) => {
              const formatted = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              setDateText(formatted);
            }}
          />
          {dateText && (
            <p className="text-base text-gray-700 font-medium bg-white px-5 py-3 rounded-full shadow-sm border border-gray-200 animate-fade-in-down">
              Selected Date: <span className="text-blue-600 font-semibold">{dateText}</span>
            </p>
          )}

          <Dropdown
            label="Amenities"
            options={uniqueAmenities}
            selected={selectedAmenity}
            onChange={setSelectedAmenity}
          />

          <Dropdown
            label="Timings"
            options={["All", ...TIME_BUCKETS.map((t) => t.label)]}
            selected={selectedTiming}
            onChange={setSelectedTiming}
          />
        </div>
      </section>

      ---

      {/* Featured Venues Grid */}
      <section className="px-4 sm:px-16 py-20 bg-white">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-14 text-center leading-tight">
          Explore Our <span className="text-blue-700">Top Venues</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {filteredVenues.length === 0 ? (
            <p className="text-xl text-gray-600 col-span-full text-center py-16">
              No venues found matching your criteria. Try adjusting your filters!
            </p>
          ) : (
            filteredVenues.map((venue, index) => (
              <SportsGardenCard
                key={index}
                garden={{
                  ...venue,
                  image: `https://api.getfitindia.in/uploads/${venue.image}`,
                }}
              />
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-20">
          <a
            href="/user/sportsvenue"
            className="inline-block bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-12 py-5 rounded-full text-2xl font-bold shadow-2xl transition transform hover:scale-105 active:scale-95 ease-out-back group relative overflow-hidden" // Larger, more prominent
          >
            <span className="relative z-10">Explore All Venues</span>
            <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-0 transition-opacity duration-300"></span> {/* Subtle overlay on hover */}
            <FiCheckCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-10 group-hover:translate-x-0" /> {/* Icon animation */}
          </a>
        </div>
      </section>

      ---

      {/* Coach Registration / Join Us Section - Elevated Design */}
      <section className="bg-gradient-to-br from-teal-500 to-cyan-600 px-4 sm:px-16 py-24 mt-20 rounded-t-[80px] rounded-bl-[80px] shadow-3xl overflow-hidden relative z-10"> {/* Complex rounded shape, stronger shadow */}
        {/* Abstract shapes/patterns in background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="0.1" d="M0,160L48,160C96,160,192,160,288,144C384,128,480,96,576,90.7C672,85,768,107,864,138.7C960,171,1056,213,1152,208C1248,203,1344,155,1392,130.7L1440,107L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
            <path fill="#ffffff" fillOpacity="0.05" d="M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,213.3C672,235,768,245,864,229.3C960,213,1056,171,1152,160C1248,149,1344,171,1392,181.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>

        <div className="relative z-20 flex flex-col md:flex-row items-center justify-center gap-16 text-white max-w-7xl mx-auto">
          {/* Text & CTA - Now on the left for a common reading flow */}
          <div className="md:w-1/2 text-center md:text-left animate-fade-in-up delay-200">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Empower Your Coaching Career <br className="hidden sm:inline" />
              <span className="text-yellow-200">Join Our Elite Network!</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-10 opacity-95">
              Are you a passionate, **certified sports coach** aiming to make a bigger impact? Partner with Get Fit India to connect with a vast pool of eager students and unlock new opportunities across the country.
            </p>
            <button
              onClick={handleOpenForm}
              className="inline-block bg-white text-teal-700 hover:bg-gray-100 font-bold text-xl sm:text-2xl px-10 py-4.5 rounded-full shadow-xl transition transform hover:scale-105 active:scale-95 ease-out-back"
            >
              Start Coaching Today
            </button>
          </div>

          {/* Image - Now on the right */}
          <div className="md:w-1/2 flex justify-center order-first md:order-last animate-fade-in-up delay-400"> {/* Image on right for contrast */}
            <img
              src={coachPortrait}
              alt="Professional Sports Coach"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-3xl shadow-2xl object-cover object-top border-4 border-white/30 transform transition-transform duration-500 hover:scale-105 ease-out-expo" // Enhanced image styling
            />
          </div>
        </div>
      </section>

      ---

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
    </div>
  );
}

const Dropdown = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left z-30">
      <button
        onClick={() => setOpen(!open)}
        className="px-6 py-3.5 text-blue-800 border-2 border-blue-300 bg-white rounded-full flex items-center justify-between text-base font-semibold shadow-md hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-opacity-60 min-w-[200px] lg:min-w-[220px] transform active:scale-98"
      >
        <span className="opacity-80">{label}:</span>{" "}
        <span className="font-bold ml-2 text-gray-900">{selected}</span>{" "}
        <FaChevronDown className={`ml-3 text-xl transform transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`} />
      </button>
      {open && (
        <div className="absolute z-40 mt-3 w-56 lg:w-64 bg-white shadow-xl rounded-lg border border-gray-100 max-h-72 overflow-y-auto animate-slide-in-down transform origin-top"> {/* Changed origin for slide down */}
          {options.map((opt) => (
            <div
              key={opt}
              className={`px-5 py-3 text-base hover:bg-blue-50 cursor-pointer transition-colors duration-150 rounded-md mx-2 my-1 ${
                selected === opt ? "font-bold text-blue-800 bg-blue-100" : "text-gray-800"
              }`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
          {(selected !== "All" && selected !== "All Cities") && (
            <div
              className="px-5 py-3 text-base text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150 rounded-md mx-2 my-1 border-t border-gray-100 mt-2 pt-3"
              onClick={() => {
                onChange(label === "City" ? "All Cities" : "All"); // Smarter clear logic
                setOpen(false);
              }}
            >
              <FaTimes className="inline mr-2 text-sm" />
              Clear Filter
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Rought;