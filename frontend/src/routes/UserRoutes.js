import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "../pages/user/Homepage";
import SportsVenue from "../pages/user/SportsVenue";
import Coaching from "../pages/user/Coaching";
import Events from "../pages/user/Events";
import Login from "../pages/user/Login";

// import { useAuth } from '../context/AuthContext';

export default function UserRoutes() {
  //   const { role } = useAuth();

  // if (role !== 'user') return <Navigate to="/user/login" />;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="login" />} />
      <Route path="login" element={<Login />} />
      <Route path="homepage" element={<Homepage />} />
      <Route path="sportsvenue" element={<SportsVenue />} />
      <Route path="coaching" element={<Coaching />} />
      <Route path="events" element={<Events />} />
    </Routes>
  );
}
