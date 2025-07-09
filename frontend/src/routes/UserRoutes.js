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

// import { useAuth } from '../context/AuthContext';

export default function UserRoutes() {
  //   const { role } = useAuth();

  // if (role !== 'user') return <Navigate to="/user/login" />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/user/login" />} />
  <Route path="login" element={<Login />} />
        <Route path="sportsvenue" element={<SportsVenue />} />
        <Route path="profile" element={<UserProfile />} />
       <Route element={<Sidebar />}>
    
      <Route path="homepage" element={<Homepage />} />
     
      <Route path="coaching" element={<Coaching />} />
      <Route path="events" element={<Events />} />
       <Route path="userdashboard" element={<UserDashboard />} />
       </Route>
    </Routes>
  );
}
