import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Homepage from "../pages/user/Homepage";
import SportsVenue from "../pages/user/SportsVenue";
import Coaching from "../pages/user/Coaching";
import Events from "../pages/user/Events";
import Login from "../pages/user/Login";
import UserDashboard from "../pages/user/UserDashboard";
import UserProfile from "../pages/user/UserProfile";
import BookingPage from "../pages/user/BookingPage";
import MyBookings from "../pages/user/MyBookings";
import CoachFormPage from "../pages/user/CoachFormPage";
import VenueDetails from "../pages/user/VenueDetails";
import BookingConfirmationPage from "../pages/user/BookingConfirmationPage";
import PaymentPage from "../pages/user/PaymentPage";
import PaymentSuccessPage from "../pages/user/PaymentSuccessPage";
import Rought from "../pages/user/Rough";

export default function UserRoutes() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAuthenticated = !!token;
  const location = useLocation();

  // Redirect admins away
  if (role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <Routes>
      {/* ✅ Default route redirects to homepage */}
      <Route path="/" element={<Navigate to="/user/homepage" />} />

      {/* ✅ Login route is always accessible */}
      <Route
        path="login"
        element={
          isAuthenticated ? (
            <Navigate to="/user/homepage" />
          ) : (
            <Login />
          )
        }
      />

      {/* ✅ Public Pages */}
       
      <Route path="homepage" element={<Homepage />} />
      <Route path="sportsvenue" element={<SportsVenue />} />
      <Route path="coach" element={<CoachFormPage />} />
      <Route path="rough" element={<Rought />} />
      <Route path="venue/:id" element={<VenueDetails />} />

      {/* 🔐 Protected Pages - only accessible if logged in */}
      <Route
        path="profile"
        element={
          isAuthenticated ? (
            <UserProfile />
          ) : (
            <Navigate to="/user/login" state={{ from: location }} />
          )
        }
      />
      <Route
        path="coaching"
        element={
          isAuthenticated ? (
            <Coaching />
          ) : (
            <Navigate to="/user/login" state={{ from: location }} />
          )
        }
      />
      <Route
        path="events"
        element={
          isAuthenticated ? (
            <Events />
          ) : (
            <Navigate to="/user/login" state={{ from: location }} />
          )
        }
      />
      <Route
        path="userdashboard"
        element={
          isAuthenticated ? (
            <UserDashboard />
          ) : (
            <Navigate to="/user/login" state={{ from: location }} />
          )
        }
      />
      <Route
        path="booking/:venueId"
        element={
          isAuthenticated ? (
            <BookingPage />
          ) : (
            <Navigate to="/user/login" state={{ from: location }} />
          )
        }
      />
      <Route
        path="mybookings"
        element={
          isAuthenticated ? (
            <MyBookings />
          ) : (
            <Navigate to="/user/login" state={{ from: location }} />
          )
        }
      />
      <Route
        path="booking-confirmation"
        element={
          isAuthenticated ? (
            <BookingConfirmationPage />
          ) : (
            <Navigate to="/user/login" state={{ from: location }} />
          )
        }
      />
      <Route
        path="payment"
        element={
          isAuthenticated ? (
            <PaymentPage />
          ) : (
            <Navigate to="/user/login" state={{ from: location }} />
          )
        }
      />
      <Route
        path="payment-success"
        element={
          isAuthenticated ? (
            <PaymentSuccessPage />
          ) : (
            <Navigate to="/user/login" state={{ from: location }} />
          )
        }
      />
    </Routes>
  );
}
