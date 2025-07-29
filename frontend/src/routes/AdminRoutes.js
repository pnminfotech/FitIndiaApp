// AdminRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import VenueList from '../pages/admin/VenueList';
import AddVenue from '../pages/admin/AddVenue';
import CoachList from '../pages/admin/CoachList';
import BookingList from '../pages/admin/BookingList';
import ManageSlots from '../pages/admin/ManageSlots';
import BlockSlotsAdmin from '../pages/admin/BlockSlotsAdmin';
import ManageAddBlockSlots from '../pages/admin/ManageAddBlockSlots';
import AdminLogin from '../pages/admin/AdminLogin';
import AllBookings from '../pages/admin/AllBookings';


export default function AdminRoutes() {
  return (
    <Routes>
       <Route path="/" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
      
        <Route path="dashboard" element={<Dashboard />} />
      
        <Route path="venues" element={<VenueList />} />
        <Route path="venues/add" element={<AddVenue />} />
        <Route path="coaches" element={<CoachList />} />
        <Route path="bookings" element={<BookingList />} /> 
         <Route path="manage" element={<ManageAddBlockSlots/>} />
           <Route path="allbookings" element={<AllBookings />} />
      
      </Route>
  <Route path="blockslot" element={<BlockSlotsAdmin/>} />
      <Route path="slots" element={<ManageSlots />} />
         
    </Routes>
  );
}
