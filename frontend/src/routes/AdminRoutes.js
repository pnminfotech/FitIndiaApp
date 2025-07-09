// AdminRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import VenueList from '../pages/admin/VenueList';
import AddVenue from '../pages/admin/AddVenue';
import CoachList from '../pages/admin/CoachList';
import BookingList from '../pages/admin/BookingList';
import ManageSlots from '../pages/admin/ManageSlots';


export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="venues" element={<VenueList />} />
        <Route path="venues/add" element={<AddVenue />} />
        <Route path="coaches" element={<CoachList />} />
        <Route path="bookings" element={<BookingList />} /> 
        <Route path="slots" element={<ManageSlots />} />
      </Route>
    </Routes>
  );
}
