import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from '../layouts/AdminLayout';
import Homepage from "../pages/user/Homepage";
import SportsVenue from "../pages/user/SportsVenue";
import Coaching from "../pages/user/Coaching";
import Events from "../pages/user/Events";
import Login from "../pages/user/Login";
import UserDashboard from "../pages/user/UserDashboard";
import Sidebar from "../pages/user/Sidebar";
import UserProfile from "../pages/user/UserProfile";
import BookingPage from "../pages/user/BookingPage";
import MyBookings from "../pages/user/MyBookings";
// import { useAuth } from '../context/AuthContext';
import CoachFormPage from "../pages/user/CoachFormPage";
import VenueDetails from "../pages/user/VenueDetails";
import Rought from "../pages/user/Rough";
export default function UserRoutes() {
  //   const { role } = useAuth();

  // if (role !== 'user') return <Navigate to="/user/login" />;
const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Routes>
  <Route path="/" element={<Navigate to="/user/login" />} />
  <Route path="login" element={<Login />} />
  {/* <Route
    path="sportsvenue"
    element={isAuthenticated ? <SportsVenue /> : <Navigate to="/user/login" />}
  /> */}
  <Route
    path="profile"
    element={isAuthenticated ? <UserProfile /> : <Navigate to="/user/login" />}
  />
  <Route >
    {/* <Route
      path="homepage"
      element={isAuthenticated ? <Homepage /> : <Navigate to="/user/login" />}
    /> */}
    <Route
      path="coaching"
      element={isAuthenticated ? <Coaching /> : <Navigate to="/user/login" />}
    />
    <Route
      path="events"
      element={isAuthenticated ? <Events /> : <Navigate to="/user/login" />}
    />
    <Route
      path="userdashboard"
      element={isAuthenticated ? <UserDashboard /> : <Navigate to="/user/login" />}
    />
    {/* <Route
  path="venue/:id"
  element={isAuthenticated ? <VenueDetails /> : <Navigate to="/user/login" />}
/> */}
    <Route path="booking/:venueId" element={isAuthenticated ? <BookingPage />: <Navigate to="/user/login" /> } />
<Route
    path="sportsvenue"
    element={<SportsVenue /> } />

    <Route path="mybookings" element={isAuthenticated ? <MyBookings /> : <Navigate to="/user/login" />} />
    <Route path="coach" element={<CoachFormPage />} />
     <Route path="homepage" element={<Homepage />} />
      <Route path="rough" element={<Rought />} />
     <Route
  path="venue/:id"
  element= {<VenueDetails />}
/>
    {/* <Route path="/user/venue/:id" element={<VenueDetails />} /> */}
  </Route>
</Routes>

  );
}
