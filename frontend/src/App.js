// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import AdminRoutes from './routes/AdminRoutes';
// import UserRoutes from './routes/UserRoutes';
// import CoachRoutes from './routes/CoachRoutes';


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/admin/*" element={<AdminRoutes />} />
//         <Route path="/user/*" element={<UserRoutes />} />
//         <Route path="/coach/*" element={<CoachRoutes />} />
//         <Route path="*" element={<Navigate to="/user/homepage" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';
import CoachRoutes from './routes/CoachRoutes';

function App() {
  return (
    <Router basename="/GetFitIndia_1"> {/* Change to "/" if hosting at root */}
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/coach/*" element={<CoachRoutes />} />
        <Route path="*" element={<Navigate to="/user/homepage" />} />
      </Routes>
    </Router>
  );
}

export default App;
