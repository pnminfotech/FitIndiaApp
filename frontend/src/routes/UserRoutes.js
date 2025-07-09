import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from '../layouts/AdminLayout';
import Homepage from "../pages/user/Homepage";
import SportsVenue from "../pages/user/SportsVenue";
import Coaching from "../pages/user/Coaching";
import Events from "../pages/user/Events";
import Login from "../pages/user/Login";
import UserDashboard from "../pages/user/UserDashboard";
import Sidebar from "../pages/user/Sidebar";

// import { useAuth } from '../context/AuthContext';

export default function UserRoutes() {
  //   const { role } = useAuth();

  // if (role !== 'user') return <Navigate to="/user/login" />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="login" />} />
       <Route element={<Sidebar />}>
      <Route path="login" element={<Login />} />
      <Route path="homepage" element={<Homepage />} />
      <Route path="sportsvenue" element={<SportsVenue />} />
      <Route path="coaching" element={<Coaching />} />
      <Route path="events" element={<Events />} />
       <Route path="profile" element={<UserDashboard />} />
       </Route>
    </Routes>
  );
}
