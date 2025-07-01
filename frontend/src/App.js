import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';
import CoachRoutes from './routes/CoachRoutes';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/coach/*" element={<CoachRoutes />} />
        <Route path="*" element={<Navigate to="/user/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
